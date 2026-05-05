const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
}));
app.use(express.json());

// Routes
const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/experts", expertRoutes);
app.use("/bookings", bookingRoutes);

// Create server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.set("io", io);

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://saniaparveen:Sania%402005@cluster0.s8tomlk.mongodb.net/bookingApp"
  )
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log(err));

// Start server
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});