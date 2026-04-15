import mongoose, { Schema } from "mongoose";

const AttemptSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  type: {
    type: String,
    enum: ["mcq", "coding"],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  aiFeedback: {
    type: String,
    default: null    // only filled for coding questions
  }
}, { timestamps: true })

export default mongoose.model("Attempt", AttemptSchema)