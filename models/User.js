import mongoose from "mongoose";
const Schema = mongoose.Schema;

const newUser = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    profilePic: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", newUser);
