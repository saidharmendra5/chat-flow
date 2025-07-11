const http = require('http');
const express = require('express');
const cors =  require('cors');
const { Server } = require('socket.io');



const app = express();

const server = http.createServer(app);


app.use(cors());

// ✅ Allow CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // React app origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

//Socket.io

io.on('connection' , (socket) => {
    console.log('A new user is connected ' , socket.id);
    socket.on("new-message" , (message) => {
        console.log("A new user message" , message);
        io.emit("message" , message);
    })
});



// can not do app.listen() directly
server.listen(9000 , () => {
    console.log("server is running at port 9000");
});