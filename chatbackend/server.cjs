require('dotenv').config();
const express = require("express");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const {connect , User} = require('./models/User.model.js');
const {Message} = require('./models/message.model.js');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {io , app ,server, getReceiverSocketId} = require('./socket.js');
const nodemailer = require('nodemailer');
const { createEmailTemplate} = require('./email-template.js');

// const app = express()   no need of this app as we created app in socket.js and imported it

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/chat', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.json());
// using app.use(cors()); is not enough , to use cookies we should use ->
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', //frontend url
    credentials: true                //required to allow cookies
}));
app.use(cookieParser());
const port = process.env.PORT;

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

const startdatabase = async () => {
    try {
        await connect();
        console.log("Database connected successfully | Starting the server...");
        server.listen(port, () => {
            console.log(`Chat server is running at port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startdatabase()

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.post('/chat/register', authLimiter, asyncHandler(async (req, res) => {
    const { fullname, password, email } = req.body;
    
    // Input validation
    if (!fullname || !password || !email) {
        return res.status(400).send({ message: "All fields are required." });
    }
    
    if (password.length < 6) {
        return res.status(400).send({ message: "Password must be at least 6 characters long." });
    }
    
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).send({ message: "This email is already in use." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    //otp

    //create otp:
    const otp = Math.floor(100000 + Math.random() * 900000);

    // creating transporter for  sending emails :
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    if (process.env.NODE_ENV !== 'production') {
        console.log("EMAIL:", process.env.EMAIL);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "missing");
    }

    // create mailOptions i.e, body and other field of email :

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "🔐 Verify Your Email - ChatFlow",
        text: `Your ChatFlow verification code is: ${otp}. This code is valid for 10 minutes. Do not share this code with anyone.`,
        html: createEmailTemplate(otp, email)
    };

    //send email :

    const stringotp = otp.toString();
    const hashedOTP = await bcrypt.hash(stringotp, 10);
    await transporter.sendMail(mailOptions);
    const newUser = new User({ fullname, password: hashedPassword, email, otp: hashedOTP, verified: false, friends: [] });
    await newUser.save();
    
    return res.status(200).send({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email
    });
}));


//user email verification :

app.post('/chat/verifyuseremail', authLimiter, asyncHandler(async (req, res) => {
    const { email, OTP } = req.body;
    
    if (!email || !OTP) {
        return res.status(400).send({ message: "Email and OTP are required." });
    }
    
    const validemail = await User.findOne({ email });
    //console.log(validemail);
    if (!validemail) {
        return res.status(400).send({ message: "Email does not exist" });
    }
    
    if (!validemail.otp) {
        return res.status(400).send({ message: "OTP has expired or already been used" });
    }
    
    const otpvalid = await bcrypt.compare(OTP, validemail.otp);
    if (otpvalid) {
        if (process.env.NODE_ENV !== 'production') {
            console.log("OTP verified successfully");
        }
        validemail.otp = null;
        validemail.verified = true;
        await validemail.save();

        //creating a jwt :
        const token = jwt.sign(
            { _id: validemail._id, fullname: validemail.fullname, email: validemail.email, createdAt: validemail.createdAt },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
        );

        //sending cookie :

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 2 * 24 * 60 * 60 * 1000 //2days in ms
        });

        return res.status(200).send({ message: "Account Verified." });
    } else {
        return res.status(400).send({ message: "OTP is invalid or expired" });
    }
}));

app.post('/chat/login', authLimiter, asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required." });
    }
    
    const isValidUser = await User.findOne({ email });
    if (!isValidUser) {
        return res.status(400).send({ message: "Incorrect user credentials" });
    }
    
    if (!isValidUser.verified) {
        return res.status(400).send({ message: "Please verify your email before logging in." });
    }
    
    const isValidPass = await bcrypt.compare(password, isValidUser.password);

    if (!isValidPass) {
        return res.status(400).send({ message: "Incorrect user credentials" });
    } else {

        //creating a jwt :
        const token = jwt.sign(
            { _id: isValidUser._id, fullname: isValidUser.fullname, email: isValidUser.email, createdAt: isValidUser.createdAt },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
        );

        //sending cookie :

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 2 * 24 * 60 * 60 * 1000 //2days in ms
        });

        return res.status(200).send({
            _id: isValidUser._id,
            message: "Login successful"
        });
    }
}));

app.post('/chat/verify', asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).send({ message: "Unauthorized: no token | login to proceed" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //if token is not valid it throws an error.
    return res.status(200).send({ message: "Access granted", user: decoded });
}));

app.post('/chat/addfriend', asyncHandler(async (req, res) => {
    const { toemail, fromemail } = req.body;

    if (!toemail || !fromemail) {
        return res.status(400).send({ message: "Both emails are required." });
    }

    const sender = await User.findOne({ email: fromemail });
    const receiver = await User.findOne({ email: toemail });

    if (!receiver || !sender) {
        return res.status(400).send({ message: "User does not exist" });
    }
    if (receiver.email === sender.email) {
        return res.status(400).send({ message: "You cannot add yourself as a friend" });
    }

    if (sender.friends.includes(receiver._id)) {
        return res.status(400).send({ message: "Already friends" });
    }

    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    await receiver.save();
    await sender.save();

    res.status(200).send({ message: "Friend added successfully" });
}));

app.post('/chat/getfriendslist', asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded._id;

    // ✅ Fetch user and populate their friends
    const user = await User.findById(userId).populate('friends', '_id fullname email');

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({
        message: "Friends retrieved successfully",
        userfriendslist: user.friends,
    });
}));

app.post("/chat/logout", asyncHandler(async (req, res) => {
    res.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.status(200).send({ message: "Logout successful" });
}));

//to send a message :
app.post("/chat/sendmessage", asyncHandler(async (req, res) => {
    const { senderId, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) {
        return res.status(400).send({ message: "SenderId, receiverId, and text are required" });
    }
    
    const newmessage = new Message({
        senderId,
        receiverId,
        text
    });

    await newmessage.save();

    //the above code saves msg to database.
    //todo : add real time functionality using socket.io : [done]

    const receiverSocketId = getReceiverSocketId(receiverId); // this function is defined in socket.js :  

    if (receiverSocketId) { //this means that the user is online.
        io.to(receiverSocketId).emit("newmessage" , newmessage);
    }

    return res.status(200).json(newmessage);
}));

//to get messages :

app.post('/chat/getmessages', asyncHandler(async (req, res) => {
    const { myId, otherId } = req.body;
    if (!myId || !otherId) {
        return res.status(400).send({ message: "myId and otherId are required" });
    }
    
    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: otherId },
            { senderId: otherId, receiverId: myId }
        ]
    }).sort({ createdAt: 1 });
    
    return res.status(200).json(messages);
}));

// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ message: "Unauthorized: Token expired" });
    }
    
    if (error.name === 'ValidationError') {
        return res.status(400).send({ message: error.message });
    }
    
    res.status(500).send({ message: "Internal server error" });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).send({ message: "Route not found" });
});