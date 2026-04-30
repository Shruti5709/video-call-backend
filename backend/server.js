const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/talentiq")
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

/* =========================
🔐 SIGNUP API
========================= */
app.post("/signup", async (req, res) => {
try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
    email,
    password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User saved successfully" });

} catch (error) {
    console.log(error);
    res.json({ message: "Error saving user" });
}
});

/* =========================
🔐 LOGIN API
========================= */
app.post("/login", async (req, res) => {
try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
    return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({
    message: "Login successful",
    token,
    });

} catch (error) {
    console.log(error);
    res.json({ message: "Error logging in" });
}
});

/* =========================
🔌 SOCKET.IO
========================= */

const io = new Server(server, {
cors: {
    origin: "*", // IMPORTANT (for phone + laptop)
    methods: ["GET", "POST"],
},
});

// ✅ SOCKET.IO LOGIC
io.on("connection", (socket) => {
console.log("User connected:", socket.id);

  // 👥 JOIN ROOM
socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("User joined room:", roomId);

    // Notify other user
    socket.to(roomId).emit("user-joined");
});

  // 📡 OFFER
socket.on("offer", ({ offer, roomId }) => {
    console.log("Sending offer");
    socket.to(roomId).emit("offer", offer);
});

  // 📡 ANSWER
socket.on("answer", ({ answer, roomId }) => {
    console.log("Sending answer");
    socket.to(roomId).emit("answer", answer);
});

  // 🧊 ICE CANDIDATE
socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
});

  // ❌ DISCONNECT
socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
});
});

// ✅ START SERVER
server.listen(5000, "0.0.0.0", () => {
console.log("Server running on port 5000");
});