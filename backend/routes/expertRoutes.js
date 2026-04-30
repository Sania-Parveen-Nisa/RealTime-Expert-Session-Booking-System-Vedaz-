const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; 

    const skip = (page - 1) * limit;

    const total = await Expert.countDocuments();

    const experts = await Expert.find()
      .skip(skip)
      .limit(limit)
      .sort({ id: 1 });

    res.json(
      experts.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.category,
        rating: e.rating,
        exp: e.exp,
      }))
    );

  } catch (err) {
    res.status(500).json({ message: "Error fetching experts" });
  }
});

module.exports = router;