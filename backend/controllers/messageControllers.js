const cloudinary = require("../lib/cloudinary");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Ai = require('../models/aiModel');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getReceiversSocketId,io } = require("../lib/socket");




exports.getUsersForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
  
      const receivedMsgs = await Message.find({ receiverId: loggedInUserId }).select("senderId");
      const senders = receivedMsgs.map(msg => msg.senderId.toString());
  
      const sentMsgs = await Message.find({ senderId: loggedInUserId }).select("receiverId");
      const receivers = sentMsgs.map(msg => msg.receiverId.toString());
  
      const userIds = [...new Set([...senders, ...receivers])];
  
      if (!userIds.length) {
        return res.status(200).json({ message: "No friends found" });
      }
  
      const chattedUsers = await User.find({ _id: { $in: userIds } }).select("-password");
  
      res.status(200).json(chattedUsers);
    } catch (error) {
      console.error("error in getUsersForSidebar", error.message);
      res.status(500).json({ message: "Internal server issue" });
    }
  };
  
  

exports.getMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const friendId = req.params.id;

        const messages = await Message.find({
            $or: [{
                $and: [
                    { senderId: loggedInUserId },
                    { receiverId: friendId }
                ]
            }, {
                $and: [
                    { senderId: friendId },
                    { receiverId: loggedInUserId }
                ]
            }]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("error in getMessages", error.message);
        res.status(500).json({ message: "Internal server issue" });
    }
}

exports.sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const friendId = req.params.id;
        const loggedInUserId = req.user._id;
        let imageUrl;
        if (image) {
            //upload Base64 image
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: loggedInUserId,
            receiverId: friendId,
            text: text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId=getReceiversSocketId(friendId);
        if(receiverSocketId){
            //each individual is in personal room whose id is socketId
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("error in send Messages", error.message);
        res.status(500).json({ message: "Internal server issue" });
    }
}

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model=genAi.getGenerativeModel({
    model:'gemini-2.0-flash'
});

exports.askAi = async (req, res) => {
    try {
        const { prompt } = req.body;
        const loggedInUserId = req.user._id;
        const result=await model.generateContent(prompt);
        if (!result) {
            return res.status(200).json({ message: "some issue with our AI" });
        }
        const newMessage = new Ai({
            userId: loggedInUserId,
            prompt,
            response:result.response.text()
        });

        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in askAi", error);
        res.status(500).json({ message: "Internal server error!" });
    }
};

exports.getAi=async(req,res)=>{
    try {
        
        const userId=req.user._id;
        const messages=await Ai.find({userId:userId}).sort({createdAt:1});

        if(!messages){
            return res.status(200).json({message:"Lets get started!"});
        }
        res.status(200).json(messages);

    } catch (error) {
        console.log("error in getAi",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.searchByEmail=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user._id == req.user._id){
            return res.status(400).json({message:"You can't text yourselves!"});
        }   
        res.status(200).json(user);     
    } catch (error) {
        console.log("error in searchByEmail",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}