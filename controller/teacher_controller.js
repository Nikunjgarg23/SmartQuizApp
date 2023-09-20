const Teacher = require('../models/teacher');


module.exports.home = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/teacher/teacherinrt');
    }

    return res.render("teacher-signin");
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/teacher/teacherinrt');
    }

    return res.render("teacher-signup");
}
module.exports.nextpage=function(req,res){
    return res.render("teacherinterface");
}

module.exports.create = function(req,res){
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
};

module.exports.createSession = function(req,res){
    return res.redirect('/teacher/teacherinrt');
}