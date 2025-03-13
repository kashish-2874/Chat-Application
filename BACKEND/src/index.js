const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.route");

const messageRoute = require("./routes/message.route");
const{app,server} = require("./lib/socket");
const connectDB = require("./lib/db");

dotenv.config();   //is used to load environment variables from a .env file into process.env in a Node.js application.
// require("./lib/db"); 

const _dirname = path.resolve();


// app.use(cors({
//     origin:"http://localhost:5173", 
//     credentials:true
// }
// )); 

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
  
const port = 5001;
server.listen(port, () => {
    console.log(`SERVER RUNNING ON PORT:${port}`);
    connectDB();
});
