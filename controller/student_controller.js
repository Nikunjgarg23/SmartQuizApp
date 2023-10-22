// const Student = require('../models/student');

const Student = require('../models/teacher');
const Quiz=require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');

module.exports.home = function(req,res){
    return res.render("studentlogin");
}

module.exports.signup = function(req,res){
    return res.render("studentlogin");
}
// module.exports.nextpage=function(req,res){
//     return res.render("teacherinterface");
// }

module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_pass){
        return res.redirect('back');
    }
    const find = async()=>{
        try{
            const user = await Student.findOne({email : req.body.email});

            if(!user){
                const data = new Student(req.body);
                data.save();
                console.log("data");
                console.log("I am Here");
                return res.render('studentinterface'); // change to signup page later
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