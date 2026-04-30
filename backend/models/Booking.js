const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  expertId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed"],
    default: "Pending",
  },
});

bookingSchema.index(
  { expertId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);