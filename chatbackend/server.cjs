require('dotenv').config();
const express = require("express");
const {connect , User} = require('./models/User.model.js');
const {Message} = require('./models/message.model.js');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {io , app ,server, getReceiverSocketId} = require('./socket.js');
const nodemailer = require('nodemailer');
const { createEmailTemplate} = require('./email-template.js');
const path = require('path');

// const app = express()   no need of this app as we created app in socket.js and imported it
app.use(express.json());
// using app.use(cors()); is not enough , to use cookies we should use ->
app.use(cors({
    origin:'http://localhost:5173', //frontend url
    credentials: true                //required to allow cookies
}));
app.use(cookieParser());
const port = process.env.PORT;

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname ,'../project/dist')));

    app.get("*" , (req , res) => {
        res.sendFile(path.join(__dirname , "../project" , "dist" , "index.html"));
    });
}


const startdatabase = async () => {
    await connect()
    .then(() => {
        console.log("database is connected successfuly | starting the server...");
        server.listen(port , () => {
            console.log("the chat server is running at port ", port);
        })
    })
}
startdatabase()

app.post('/chat/register' ,async (req , res) => {
    const { fullname , password , email} = req.body;
    const userExist = await User.findOne({email});
    if ( userExist){
        return res.status(400).send({message:"This email is already in use."});
    }
    const hashedPassword = await bcrypt.hash(password , 10);

    //otp

    //create otp:
    const otp = Math.floor(100000 + Math.random() * 900000);

    // creating transporter for  sending emails :
    const transporter = nodemailer.createTransport({
        service:'gmail',
         auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASS
        }
    })

    console.log("EMAIL:", process.env.EMAIL);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "missing");
    console.log("user mail" , email);

    // create mailOptions i.e, body and other field of email :

const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "🔐 Verify Your Email - ChatFlow",
    text: `Your ChatFlow verification code is: ${otp}. This code is valid for 10 minutes. Do not share this code with anyone.`,
    html: createEmailTemplate(otp, email)
};


    //send email :

    try {
        const stringotp = otp.toString();
        const hashedOTP = await bcrypt.hash(stringotp , 10);
        await transporter.sendMail(mailOptions);
            const newUser = new User({fullname , password:hashedPassword, email, otp : hashedOTP , verified : false,friends :[]});
             await newUser.save();
    return res.status(200).send({
        _id:newUser._id ,
        fullname : newUser.fullname ,
        email: newUser.email
    });
    } catch (error) {
          console.log(error);
        return res.status(400).send({message : `some thing went wrong ${err}`});
    }

})



//user email verification :

app.post('/chat/verifyuseremail' , async(req , res) => {
    const { email , OTP} = req.body;
    const validemail = await User.findOne({email})
    //console.log(validemail);
    if(!validemail){
        return res.status(400).send({message:"email does not exist"})
    }
    const otpvalid = await bcrypt.compare(OTP , validemail.otp  );
    if(otpvalid ){
        console.log("otp is verified");
        validemail.otp = null;
        validemail.verified = true;
        await validemail.save();
        
        //creating a jwt :
        const  token = jwt.sign( {_id :validemail._id , fullname : validemail.fullname , email : validemail.email ,createdAt :validemail.createdAt} , process.env.JWT_SECRET_KEY , {expiresIn: "2d"});

        //sending cookie :

        res.cookie("token" , token , {
            httpOnly:true,
            secure:true, // change to true in production
            maxAge: 2 * 24 * 60 * 60 * 1000 //2days in ms
        });

        
        return res.status(200).send({message:"Account Verified."})
        
    }else{
        return res.status(400).send({message:"OTP is invalid or expired"})
    }


})

app.post('/chat/login' , async (req , res) => {
    const { email , password} = req.body;
    const isValidUser = await User.findOne({email});
    if(!isValidUser){
        return res.status(400).send({message:"incorrect user credentials"});
    }
    const isValidPass = await bcrypt.compare(password , isValidUser.password);

    if(! isValidPass){
        return res.status(400).send({message:"incorrect user credentials"});
        
    }else{

        //creating a jwt :
        const  token = jwt.sign( {_id :isValidUser._id , fullname : isValidUser.fullname , email : isValidUser.email ,createdAt : isValidUser.createdAt} , process.env.JWT_SECRET_KEY , {expiresIn: "2d"});

        //sending cookie :

        res.cookie("token" , token , {
            httpOnly:true,
            secure:false, // change to true in production
            maxAge: 2 * 24 * 60 * 60 * 1000 //2days in ms
        });

        return res.status(200).send({
        _id:isValidUser._id,
        message:"login successful"
    });
    }

})

app.post('/chat/verify' , (req , res) => {
    const token = req.cookies.token ;

    if (!token){
        return res.status(400).send({message:" unauthorized : no token | login to proceed"})
    }
    try{

    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
    //if token is not valid it throws an error.
   // console.log("decoded data : " , decoded);
    return res.status(200).send({message:"access granted" , user : decoded});
    
    }
    catch(err){
        return res.status(400).send({message: "Unauthorized: Invalid token"});
    }

})


app.post('/chat/addfriend' ,async (req , res ) => {
    const {toemail , fromemail} = req.body;
    
    
    const sender = await User.findOne({email : fromemail});
    const receiver = await User.findOne({email : toemail});
    
    if(!receiver || !sender){
        return res.status(400).send({message:"user does not exist"});
    }
    if ( receiver.email === sender.email){
         return res.status(400).send({message:"we know you are single , but still you can't add yourself as a friend"});
    }
    
    if ( sender.friends.includes(receiver._id)){
        return res.status(400).send({message : "already friends"});
    }


    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);
    

    await receiver.save();
    await sender.save();

    res.status(200).send({message : "friend added successfully"});

})

app.post('/chat/getfriendslist', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  try {
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

  } catch (err) {
    console.error("JWT decode or DB error:", err);
    return res.status(401).send({ message: "Unauthorized: Invalid or expired token" });
  }
});

app.post("/chat/logout", async(req , res) => {
    res.clearCookie('token' , {
        path:'/',
        httpOnly:true,
        secure:false
    });
    res.status(200).send({message : "Logout successful"})
})

//to send a message :
app.post("/chat/sendmessage" , async (req , res) => {
    const {senderId , receiverId , text} = req.body;
    if (!senderId || !receiverId ){
        return res.status(400).send({message:"error in sending msg | server side"});
    }
    const newmessage = new Message({
        senderId,
        receiverId,
        text
    })

    await newmessage.save();

    //the above code saves msg to database.
    //todo : add real time functionality using socket.io : [done]

    const receiverSocketId = getReceiverSocketId(receiverId); // this function is defined in socket.js :  

    if(receiverSocketId){ //this means that the user is online.
        io.to(receiverSocketId).emit("newmessage" , newmessage);
    }

    return res.status(200).json(newmessage);
});

//to get messages :

app.post('/chat/getmessages' , async(req , res) => {
    const {myId , otherId} = req.body;
    if(!myId || !otherId){
        return res.status(400).send({message:"error in getting messages (myId or otherId) "});
    }
    const messages = await Message.find({
        $or: [
            {senderId : myId , receiverId :otherId},
             {senderId : otherId , receiverId :myId}
        ]
    });
    return res.status(200).json(messages);
})