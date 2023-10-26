// const Student = require('../models/student');

const Student = require('../models/teacher');
const Quiz=require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');
const { model } = require('mongoose');

module.exports.home = function(req,res){
    if(req.isAuthenticated() && req.user.role=='teacher'){
        console.log('ok');
        return res.redirect('/teacher/logout');
    }
    if(req.isAuthenticated()){
        return res.redirect('/student/studentinrt');
    }
    else if(!req.isAuthenticated){
        return res.render('Alert');
    }
    else
     return res.render("studentlogin");
}

module.exports.signup = function(req,res){
    return res.render("studentlogin");
}
module.exports.nextpage=function(req,res){
    return res.render("studentinterface");
}

module.exports.logout = function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
}


module.exports.viewquiz = function(req,res){
    const getquiz = async ()=>{
        const ress = await Quiz.find({upload:true});
        //console.log(ress);
        return res.render('viewquizstudent',{
            title : "Past Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_pass){
        return res.redirect('back');
    }
    const find = async()=>{
        try{
            const user = await Student.findOne({email : req.body.email});

            if(!user || user.role!="student"){
                req.body.role = "student";
                const data = new Student(req.body);
                data.save();
                console.log("data");
                console.log("I am Here");
                return res.redirect('/student'); // change to signup page later
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
};

module.exports.createSession = function(req,res){
    return res.redirect('/student/studentinrt');
}