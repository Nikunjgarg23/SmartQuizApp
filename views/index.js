import { log } from "console";
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//const db = require('../config/mongoose');
import db from "./config/mongoose.js";
import Teacher from "./models/teacher.js";
app.use(express.urlencoded());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("index.ejs");
});

app.get("/student", function (req, res) {
    res.render(__dirname + "/student.ejs");
});


app.get("/teacher", function (req, res) {
    res.render(__dirname + "/teacher-signin.ejs");
});


app.get("/teacher/signup", function (req, res) {
    res.render(__dirname + "/teacher-signup.ejs");
});


app.get("/assessment", function (req, res) {
    res.render(__dirname + "/assessment.ejs");
});

app.post('/teacher/create',function(req,res){
    if(req.body.password != req.body.confirm_pass){
        return res.redirect('back');
    }
    const find = async()=>{
        try{
            const user = await Teacher.findOne({email : req.body.email});

            if(!user){
                const data = new Teacher(req.body);
                data.save();
                return res.redirect('/teacher'); // change to signup page later
            }
            else{
                return res.redirect('/teacher/signup');
            }
        }
        catch(err){
            console.log(err);
        }
    }
    find();
});


app.listen("3000", () => {
    console.log(`server is running on port 3000`);
});