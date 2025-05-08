const express = require("express");
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");
const { app, server } = require("./lib/socket");
const connectDB = require("./lib/db");

// Middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());


app.use(
  cors({
    // origin:"https://chat-application-puce-tau.vercel.app",
    origin : "https://chat-application-8phfkxaso-kashishs-projects-389cba67.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
dotenv.config({ path: path.join(__dirname, "../.env") });
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

// Start server and connect to MongoDB
const port = 5001;
server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT:${port}`);
  connectDB();
});
