const {Server}=require('socket.io');
const http=require('http');
const express=require('express');
require('dotenv').config();

const app=express();
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:[process.env.FRONTEND_URL],
        credentials:true
    }
});

//this is used to store online users
const userSocketMap={};

//function for receivers socketId

const getReceiversSocketId=(userId)=>{
    return userSocketMap[userId];
}

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }
    console.log(Object.keys(userSocketMap));
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});

module.exports={io,app,server,getReceiversSocketId};