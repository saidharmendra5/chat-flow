const jwt =  require("jsonwebtoken");
require('dotenv').config();

const user = "usfqueygf87273r7gdbasf" ;

const token = jwt.sign(user , process.env.JWT_SECRET_KEY , {expiresIn :"2d" });

console.log(token);