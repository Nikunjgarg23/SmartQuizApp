
const Teacher = require('../models/teacher');
const Quiz = require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');
const bcrypt = require('bcryptjs');
const Configuration = require("openai");
const OpenAIApi = require("openai");
const OpenAI = require("openai");
const openaii = new OpenAI();
const nodemailer = require('nodemailer');
const configuration = new Configuration({


    apiKey: process.env.OPENAI_API_KEY,
});

let gemail = null;
let gname = null;
let gpassword = null;
let grol;


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'keshavmantry01@gmail.com', // Your Gmail address
        pass: 'bwxy yddi doib neri' // Your Gmail password
    }
});
function generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}
module.exports.verifypassword = function (req, res) {
    try {
        const otp = req.body.otp;
        if (otp === req.session.otp) {
            // If OTP is correct, clear the OTP session variable and redirect to login page
            req.session.otp = null;
            return res.render('changeforgot');

        } else {
            return res.render('Alert', { message: 'Invalid OTP' });
        }
    } catch (err) {
        console.log(err);
        return res.render('Alert', { message: 'Error verifying OTP' });

    }



};

module.exports.home = function(req,res){
    if(req.isAuthenticated()){
        console.log('ok');
        return res.redirect('/teacher/logout');
    }
    return res.render('index');
}
module.exports.forgot = async function (req, res) {
    try {
        const email = req.body.email;
        const user = await Teacher.findOne({ email: email });
        
        if (!user) {
            console.log("User not found");
            return res.render('Alert', { message: 'User not found' });
        } else {
            gemail=email;
            console.log("User found. Proceed with password reset.");
            let otp = generateOTP();
            let mailOptions = {
                from: 'keshavmantry01@gmail.com',
                to: req.body.email,
                subject: 'Your OTP for Sign Up',
                text: `Your OTP is: ${otp}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.render('Alert');
                } else {
                    console.log('Email sent: ' + info.response);
                    // Save the OTP in session for verification later
                    req.session.otp = otp;
                    return res.render('ResetPasswordForm'); // Redirect to OTP verification page
                }
            });
        }


    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send("Internal Server Error");
    }
};


module.exports.resetpass = async function(req, res) {
    try {
       
        const newPassword = req.body.new_password;

        // Find the user by email
        const user = await Teacher.findOne({ email: gemail });

        // If user not found, return an error
      

        // Update the user's password
        const salt = await bcrypt.genSalt(10);

        // console.log("ppp");
        let pass = await bcrypt.hash(newPassword, salt);
        user.password = pass;
        
        // Save the updated user object back to the database
        await user.save();

        console.log("Password updated successfully");
        return res.render('teacher-signup')
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
