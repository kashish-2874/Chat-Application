const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
    email:{type:String,required:true,unique:true},
    fullName:{type:String,required:true},
    password:{type:String,required:true,minLength: 6},
    profilePic:{type:String,default:""},

    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }
    },
    {timestamps:true} // this is used to keep the fields like member since created at etc;..

)

const User = mongoose.model("User",userSchema);
module.exports = User;