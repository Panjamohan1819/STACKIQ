import Question from "../models/Question.js";
import Attempt from "../models/Attempts.js";

import Groq from 'groq-sdk';

// ====================== Groq Clients ======================
let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    if (!process.env.GROQ_API) {
      throw new Error("GROQ_API key is missing from environment variables!");
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API });
  }
  return groqClient;
};

// ====================== Call Groq Helper ======================
const callGroq = async (systemContent, userContent, model = "llama-3.1-8b-instant") => {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemContent || "You are a helpful assistant." },
      { role: "user", content: userContent }
    ],
    model: model,
    temperature: model.includes("70b") ? 0 : 0.7,   // 0 for evaluation, 0.7 for generation
    max_tokens: model.includes("70b") ? 800 : 2048,
    response_format: model.includes("70b") ? { type: "json_object" } : undefined,
  });
  
  return completion.choices[0]?.message?.content || "";
};

// ====================== JSON Extractors ======================
const extractJson = (raw) => {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON array format from AI");
  }
  let jsonStr = raw.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    jsonStr = jsonStr
      .replace(/\\(?!["\\/bfnrt])/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
    return JSON.parse(jsonStr);
  }
};

const extractJSONObject = (raw) => {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON object format from AI");
  }
  let jsonStr = raw.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    jsonStr = jsonStr
      .replace(/\\(?!["\\/bfnrt])/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
    return JSON.parse(jsonStr);
  }
};

// ================================
// POST /prepapp/ai/generate
// ================================
export const generateQuestion = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "topic and difficulty are required" });
    }

    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ message: "difficulty must be easy, medium or hard" });
    }

    const codingRestrictedTopics = ["os", "networking"];
    const skipCoding = codingRestrictedTopics.includes(topic.toLowerCase());

    // MCQ Prompt
    const mcqPrompt = `You are an expert ${topic} examination creator.
Generate exactly 5 ${difficulty} difficulty MCQ questions about ${topic}.
Output ONLY a JSON array. No text before or after.

STRICT RULES:
- Each question must be specific and meaningful about ${topic}
- Each option must be a real meaningful answer
- correctAnswer must be copied EXACTLY from one of the 4 options

[
  {
    "title": "A specific technical question about ${topic}?",
    "type": "mcq",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "options": ["First real answer", "Second real answer", "Third real answer", "Fourth real answer"],
    "correctAnswer": "First real answer"
  }
]`;

    // Coding Prompt
    const codingPrompt = `You are an expert ${topic} coding challenge creator.
Generate exactly 1 ${difficulty} difficulty coding question about ${topic}.
Output ONLY a JSON array. No text before or after.

[
  {
    "title": "Write a function that solves a specific ${topic} problem.",
    "type": "coding",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "options": [],
    "correctAnswer": "A clear description of the expected solution approach"
  }
]`;

    const normalizeQuestion = (q) => ({
      ...q,
      topic: topic.toLowerCase(),
      difficulty: difficulty.toLowerCase(),
      options: q.type === "coding" ? [] : q.options || [],
    });

    // Generate in parallel using fast model
    const [mcqRaw, codingRaw] = await Promise.all([
      callGroq(null, mcqPrompt, "llama-3.1-8b-instant"),
      skipCoding ? Promise.resolve(null) : callGroq(null, codingPrompt, "llama-3.1-8b-instant"),
    ]);

    const mcqQuestions = extractJson(mcqRaw).map(normalizeQuestion);
    const codingQuestions = codingRaw
      ? extractJson(codingRaw).map(normalizeQuestion)
      : [];

    const validMcq = mcqQuestions.filter(
      (q) => q.title && q.correctAnswer && q.options?.length === 4
    );
    const validCoding = codingQuestions.filter((q) => q.title && q.correctAnswer);

    if (validMcq.length === 0) {
      return res.status(500).json({ message: "Failed to generate valid MCQ questions" });
    }

    const [saveMcq, saveCoding] = await Promise.all([
      Question.insertMany(validMcq),
      validCoding.length > 0 ? Question.insertMany(validCoding) : Promise.resolve([]),
    ]);

    res.status(201).json({
      message: "Questions generated successfully",
      total: saveMcq.length + saveCoding.length,
      questions: [...saveMcq, ...saveCoding],
    });

  } catch (err) {
    next(err);
  }
};

// ================================
// POST /prepapp/ai/evaluate   ← Strict Evaluation with 70B
// ================================
export const evaluateAnswer = async (req, res, next) => {
  try {
    const { questionId, userCode, userAnswer, language, questionType } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: "questionId is required" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Determine type: explicit questionType, or infer from question model
    const qType = questionType || question.type || "coding";

    // ====================== MCQ Evaluation (simple comparison) ======================
    if (qType === "mcq") {
      if (!userAnswer) {
        return res.status(400).json({ message: "userAnswer is required for MCQ" });
      }

      const isCorrect =
        question.correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

      await Attempt.create({
        userId: req.user.id,
        questionId: question._id,
        type: "mcq",
        topic: question.topic,
        userAnswer,
        isCorrect,
      });

      return res.status(200).json({
        isCorrect,
        correctAnswer: question.correctAnswer,
        feedback: isCorrect
          ? "Correct! Well done."
          : `Incorrect. The correct answer is: ${question.correctAnswer}`,
        suggestion: isCorrect
          ? "No suggestion needed"
          : "Review the core concepts related to this topic.",
        nextDifficulty: isCorrect ? "hard" : "easy",
      });
    }

    // ====================== Coding Evaluation (AI-powered) ======================
    if (!userCode || !language) {
      return res.status(400).json({
        message: "userCode and language are required for coding questions",
      });
    }

    const systemPrompt = `You are an extremely strict senior software engineer and coding interviewer.

STRICT EVALUATION RULES (Never break these):
- If the code is gibberish, random text, "na", "idk", empty, or completely unrelated → isCorrect MUST be false.
- If the code has obvious syntax errors or would not run → isCorrect MUST be false.
- If the code does not solve the problem correctly (wrong logic, missing edge cases, poor implementation) → isCorrect MUST be false.
- ONLY set isCorrect: true if the code is a reasonably correct and working solution.

Be harsh. Do not give credit for effort on bad or nonsense code.

Reply with ONLY valid JSON in this exact format. No extra text:

{
  "isCorrect": boolean,
  "feedback": "Short, direct, professional feedback (2-3 sentences max)",
  "suggestion": "One specific improvement tip or 'No suggestion needed' if perfect",
  "nextDifficulty": "easy" | "medium" | "hard"
}`;

    const userPrompt = `Question: ${question.title}
Difficulty: ${question.difficulty || "medium"}

Student's ${language} Code:
${userCode}`;

    const rawResponse = await callGroq(
      systemPrompt,
      userPrompt,
      "llama-3.3-70b-versatile"
    );

    let parsed;
    try {
      parsed = extractJSONObject(rawResponse);
    } catch (e) {
      parsed = {
        isCorrect: false,
        feedback: "Failed to parse AI response. Please try again.",
        suggestion: "Try submitting clearer code.",
        nextDifficulty: "easy",
      };
    }

    const { isCorrect, feedback, suggestion, nextDifficulty } = parsed;

    await Attempt.create({
      userId: req.user.id,
      questionId: question._id,
      type: "coding",
      topic: question.topic,
      userAnswer: userCode,
      isCorrect,
      aiFeedback: feedback,
      language,
    });

    res.status(200).json({
      isCorrect,
      feedback,
      suggestion,
      nextDifficulty: nextDifficulty || (isCorrect ? "hard" : "easy"),
    });

  } catch (err) {
    console.error("Evaluation Error:", err);
    next(err);
  }
};

export default { generateQuestion, evaluateAnswer };