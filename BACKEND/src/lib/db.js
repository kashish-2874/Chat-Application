// require("dotenv").config();
const mongoose = require("mongoose");


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.log("MongoDB connection error:", error);
    }
  };

module.exports = connectDB;

// const url = process.env.MONGO_URL
// mongoose.connect(url)
// .then((url)=>{
//     console.log("MongoDB connected!!");
// }).catch((err)=>{
//     console.log("error connecting mongoDB: " + err);
// })

// const mongoose = require("mongoose") ; 

// const url = process.env.MONGO_URL ; 
// mongoose.connect(url) 
// .then(()=> {
//     console.log("Mongodb connected") ; 
// }).catch((err)=>{
//     console.log("error connecting mongodb : "+err) ; 
// })