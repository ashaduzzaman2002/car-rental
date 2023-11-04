import mongoose from "mongoose";
const Schema = mongoose.Schema;

const newOTP = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    
  },

  value: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

export default mongoose.model("OTP", newOTP);
