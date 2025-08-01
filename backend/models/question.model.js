import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    revise: {
      type: Boolean,
      default: false,
    },
    difficulty:{
      type: String
    },
    notes:{
      type: String ,
      default:null , 
      required: false
    },
    tags: [
      {
        type: String,
        trim: true,
      }
    ],
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", QuestionSchema);
