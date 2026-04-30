const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
   id: Number,  
  name: String,
  category: String,
  rating: Number,
  exp: String,
});

module.exports = mongoose.model("Expert", expertSchema);