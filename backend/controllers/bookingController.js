import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { expertId, date, timeSlot, name, email, phone } = req.body;

    if (!expertId || !date || !timeSlot || !name || !email || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await Booking.findOne({
      expertId,
      date,
      timeSlot,
    });

    if (existing) {
      return res.status(400).json({
        message: "This slot is already booked",
      });
    }

    const booking = await Booking.create({
      expertId,
      date,
      timeSlot,
      name,
      email,
      phone,
      status: "Pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const bookings = await Booking.find({ email });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};