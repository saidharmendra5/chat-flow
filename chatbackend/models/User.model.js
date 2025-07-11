require('dotenv').config();
const mongoose = require("mongoose");


const connect = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to Mongo db atlas ");
    })
    .catch((err) => {
        console.log("connection to database failed " , err);
    })
}


const userSchema = new mongoose.Schema({
    fullname:{type:String , required:true},
    password:{type:String , required:true },
    email:{type:String , required:true , unique:true},
    otp : {type:String},
    verified:{type:Boolean , required:true},
    friends :[{type : mongoose.Schema.Types.ObjectId , ref :"User"}]
},{timestamps : true});

const User = mongoose.model('User' , userSchema);

module.exports = {connect , User};
