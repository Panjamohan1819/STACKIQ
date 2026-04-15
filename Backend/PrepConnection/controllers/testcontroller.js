import Question from '../models/Question.js'
import Attempt from '../models/Attempts.js'

export const getQuestion = async (req, res, next) => {
  try {
    const { type, topic } = req.query

    if (!type || !topic) {
      return res.status(400).json({ message: 'type and topic are required' })
    }

    const questions = await Question.find({ type, topic }).select('-correctAnswer')

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this topic' })
    }

    res.status(200).json(questions)

  } catch (err) {
    next(err)
  }
}

export const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, userAnswer } = req.body

    
    if (!questionId || !userAnswer) {
      return res.status(400).json({ message: 'questionId and userAnswer are required' })
    }

    
    const question = await Question.findById(questionId)
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    
    const isCorrect = question.correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim()

    
    await Attempt.create({
      userId: req.user.id,
      questionId: question._id,
      type: question.type,
      topic: question.topic,
      userAnswer,
      isCorrect
    })

   
    res.status(201).json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      message: isCorrect ? 'Correct answer!' : 'Wrong answer!'
    })

  } catch (err) {
    next(err)
  }
}