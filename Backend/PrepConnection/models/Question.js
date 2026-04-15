import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ["mcq", "coding"]
  },
  topic: {
    type: String,
    required: true,
    trim: true,
    enum: ["dsa", "dbms", "os", "networking", "algorithms"]
  },
  options: {
    type: [String],   // only for MCQ, e.g. ["A", "B", "C", "D"]
    default: []
  },
  correctAnswer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  }
}, { timestamps: true })

export default mongoose.model("Question", QuestionSchema)