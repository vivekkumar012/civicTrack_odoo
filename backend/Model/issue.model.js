import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "InProgress", "Resolved"],
      default: "Pending",
    },
    location :{
      type:String ,
    }
  },
  { timestamps: true }
);

export const Issue = mongoose.model("Issue", issueSchema);
