const {Server} = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});




//used to store online users :

const userSocketMap = {}; // stores in format of {userID : socketId} key : value pair

// a function that returns socketID when userID is passed :

 const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
 }
io.on("connection" ,(socket) => {
    console.log("a user connected " , socket.id);

    const userId = socket.handshake.query.userId
    if(userId){
      userSocketMap[userId] = socket.id;
    }

    //io.emit is used to send events to all connected sockets
    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    socket.on('new-message' , (message) => {// ithink this function is not used . checklater
      io.emit('message' , message);
    });
    socket.on("disconnect" , () => {
        console.log("user disconnected " , socket.id);
        delete userSocketMap[userId];
    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    });
}); 

module.exports = { io , app ,server ,getReceiverSocketId };