import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carSchema = new Schema({
  carName: {
    type: String,
    required: true,
  },
  modelNo: {
    type: String,
    required: true,
  },
  numberOfSeats: {
    type: Number,
    required: true,
  },
  numberOfDoors: {
    type: Number,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  geartype: {
    type: String,
    required: true,
  },
  ac: {
    type: Boolean,
    required: true,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    amountType: {
      type: String,
      enum: ["day", "week", "month"],
      required: true,
    },
  },
  carPhotos: [],
  carInteriorPhotos: [],
  UserId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Other car-related fields
});

export default mongoose.model("Car", carSchema);
