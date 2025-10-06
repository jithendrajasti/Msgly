const User = require('../models/userModel');
const { generateToken } = require('../lib/utils');
const bcrypt = require('bcryptjs');
const cloudinary = require('../lib/cloudinary');
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("error in loginController", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Pasword must be at least 6 characters" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "email already registered!" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName, email, password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("error in sigupController", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.logout = async (req, res) => {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
      console.log("Error in logout controller function", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

exports.updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, { new: true }).select("-password");
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update Profile controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.checkAuth=async(req,res)=>{
       try {
          res.status(200).json(req.user);
       } catch (error) {
        console.log("Error in check Auth controller", error.message);
        res.status(500).json({ message: "Internal server error" });
       }
}


exports.resetPass=async(req,res)=>{
    try {
        const {email,newPassword,confirmPassword}=req.body;
        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({message:"All fields are mandatory"});
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({message:"Both the passwords must be same"});
        }
        const userr=await User.findOne({email:email});
        if(!userr){
            return res.status(400).json({message:"email not registered"});
        }
        const userId=userr._id;
        
        const salt=await bcrypt.genSalt(12);
        const newHashedPassword=await bcrypt.hash(newPassword,salt);
        const user=await User.findByIdAndUpdate(userId,{
            password:newHashedPassword
        },{new:true}).select("-password");
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in resetPass controller",error.message);
        res.status(500).json({message:"Internal server issue"});
    }
}
