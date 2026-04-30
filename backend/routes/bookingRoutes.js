const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    const io = req.app.get("io");


    io.emit("slotBooked", {
      expertId: booking.expertId,
      date: booking.date,
      timeSlot: booking.timeSlot,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.log("Booking Error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const io = req.app.get("io");

    console.log(" Slot Cancelled:", deleted);

    io.emit("slotCancelled", {
      expertId: deleted.expertId,
      date: deleted.date,
      timeSlot: deleted.timeSlot,
    });

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const io = req.app.get("io");

    io.emit("statusUpdated", {
      id: updated._id,
      status: updated.status,
    });

    res.json(updated);
  } catch (err) {
    console.log("Update Error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;