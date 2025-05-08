// const { raw } = require("express");
const generateToken = require("../lib/utils");
const User  = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/cloudinary");
const sendMailServer = require("../lib/sendEmail");


const signup = async(req,res) =>{
    const {fullName,email,password} = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        if(password.length < 6){
            return res.status(400).json({message:"password must be at least 6 characters"});
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message:"email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,email,password:hashedPassword
        })

        if(newUser){
            // generate jwt token here
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else{
            res.status(400).json({message:"invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message:"internal server error"});
    }
}

const login = async (req,res) =>{
    const{email,password} = req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"invalid credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"invalid credentials"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    }catch(error){
        console.log("error in login controller",error.message);
        res.status(500).json({message:"internal server error"});
    }
}

const logout = (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logged out successfully"});
    } catch (error) {
        console.log("error in logout controller",error.message);
        res.status(500).json({message:"internal server error"});
    }
}

const updateProfile = async (req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:",error);
        res.status(500).json({message:"Internal server error:"})                      
    }
}

const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkauth controller", error.message);
        res.status(500).json({message:"internal server error"});
    }
}

const forgotPassword = async (req,res)=>{
    const {email} = req.body;
    console.log(email);
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found", boolean:false});
        }

        // generate otp 
        const resetToken = Math.floor(1000 + Math.random() * 9000);
        console.log(resetToken);

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now()+15*60*1000;  //15 min

        await user.save();

        const subject = `Your password reset OTP is: ${resetToken}. It is valid for 15 minutes.`;
        const recipient = email;

        sendMailServer(subject,recipient);
        res.status(200).json({message:"OTP sent successfully",boolean:true});

    } catch (error) {
        console.error("error in forget password: ",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

const verifyOtp = async(req,res)=>{
    const{email,otp} = req.body;
    try {
        if(!email || !otp){
            return res.status(400).json({message:"One fields missing",boolean:false})
        }
        const user = await User.findOne({email});
        if(!user || user.passwordResetToken != otp || user.passwordResetExpires < Date.now()){
            return res.status(400).json({message:"Invalid or expired OTP please try again",boolean:false})
        }
        // user.passwordResetToken = undefined;
        // user.passwordResetExpires = undefined;

        // await user.save();

        res.status(200).json({message:"Otp verified successfully!!",boolean:true});

    } catch (error) {
        console.error("Error in reset password: ",error.message);
        res.status(500).json({messgae:"Internal server error"});
    }
}

const resetPassword = async(req,res)=>{
    const{email,newPassword} = req.body;
    console.log(email,newPassword) ; 
    try {
        if(!email || !newPassword){
            console.log("NOT EMAIL AND NOT PASSWORD") ; 
            return res.status(400).json({message:"All fields are required",boolean:false});
        }
        const user = await User.findOne({email});

        if(newPassword.length < 6){
            console.log("PASSWORD < 6") ; 
            return res.status(400).json({message:"Password must be atleast 6 characters",boolean:false})
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        res.status(200).json({message:"Password reset Successfully",boolean:true});
    } catch (error) {
        console.error("Error in reset password: ",error.message);
        res.status(500).json({messgae:"internal server error",boolean:false});
    }
}

module.exports = {signup,login,logout,updateProfile,checkAuth,forgotPassword,resetPassword,verifyOtp}
