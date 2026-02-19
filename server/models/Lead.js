import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ["New", "Contacted", "Follow Up", "Appointment Booked", "Converted", "Lost"],
  },
  revenue: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Lead", leadSchema);
