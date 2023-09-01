// import { log } from "console";
// import express from "express";
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const app = express();
//import db from "../config/mongoose.js";

const express = require('express');
const app = express();
const db = require('./config/mongoose');

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.urlencoded());
app.use(express.static('public'));

//const db = require('../config/mongoose');
// import Teacher from "../models/teacher.js";
// app.use(express.urlencoded());


// app.use(express.static("public"));
app.use('/',require('./routes'));
// app.get("/", function (req, res) {
//     return res.render("index");
// });
app.get("/student", function (req, res) {
    return res.render("student");
});


// app.get("/teacher", function (req, res) {
//     return res.render("teacher-signin");
// });


// app.get("/teacher/signup", function (req, res) {
//     return res.render("teacher-signup");
// });


app.get("/assessment", function (req, res) {
    return res.render("assessment");
});

// app.post('/teacher/create',function(req,res){
//     if(req.body.password != req.body.confirm_pass){
//         return res.redirect('back');
//     }
//     const find = async()=>{
//         try{
//             const user = await Teacher.findOne({email : req.body.email});

//             if(!user){
//                 const data = new Teacher(req.body);
//                 data.save();
//                 return res.redirect('/teacher'); // change to signup page later
//             }
//             else{
//                 return res.redirect('/teacher/signup');
//             }
//         }
//         catch(err){
//             console.log(err);
//         }
//     }
//     find();
// });


app.listen("3000", () => {
    console.log(`server is running on port 3000`);
});