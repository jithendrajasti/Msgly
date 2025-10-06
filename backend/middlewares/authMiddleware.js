const jwt=require('jsonwebtoken');
const User = require('../models/userModel');

exports.protectRoute=async(req,res,next)=>{
     try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - no token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - token is invalid"});
        }
        const user=await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        req.user=user;

        next();
     } catch (error) {
        console.log("Error in authMiddleware",error.message);
        return res.status(500).json({message:"Internal server error"});
     }
}
