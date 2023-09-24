const Teacher = require('../models/teacher');
const Quiz=require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');


module.exports.createQuiz = (req, res) => {
    const find = async()=>{
        try{
            const user = await Quiz.findOne({quizname : req.body.quizname});

            if(!user){
                const data = new Quiz(req.body);
                data.save();
                const user2 = await Quiz.findOne({quizname : req.body.quizname});
                console.log(user2);
                return res.render('Question',{
                    idd : user2.id
                }); 
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
}
module.exports.pastquiz = function(req,res){
    const getquiz = async ()=>{
        const ress = await Quiz.find({});
        //console.log(ress);
        return res.render('displaypastquiz',{
            title : "Past Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}
module.exports.viewquiz = function(req,res){
    let id = req.query.id;
    const getquiz = async ()=>{
        const ress = await Question.find({quizid : id});
        //console.log(ress);
        return res.render('viewquiz',{
            title : "Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}
module.exports.deletequiz = function(req,res){
    let id = req.query.id;
    // let contind = contactList.findIndex(contact => contact.number==phone);
    // if(contind!=-1){
    //     contactList.splice(contind,1);
    // }
    const dele = async()=>{
        try{
            const ress = await Quiz.deleteOne({_id: id});
            return res.redirect('back');
        }catch(err){
            console.log(err);
            return ;
        }
    }
    dele();
};

module.exports.deleteques = function(req,res){
    let id = req.query.id;
    // let contind = contactList.findIndex(contact => contact.number==phone);
    // if(contind!=-1){
    //     contactList.splice(contind,1);
    // }
    const dele = async()=>{
        try{
            const ress = await Question.deleteOne({_id: id});
            return res.redirect('back');
        }catch(err){
            console.log(err);
            return ;
        }
    }
    dele();
};

module.exports.home = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/teacher/teacherinrt');
    }
    else if(!req.isAuthenticated){
        return res.render('Alert');
    }
    else
    return res.render("teacher-signup");
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/teacher/teacherinrt');
    }
    return res.render("Alert");
}
module.exports.changepassword = function(req,res){
    if(!req.isAuthenticated()){
        return res.redirect('Alert');
    }

    return res.render("changepass");
}

module.exports.changepass = async function(req,res){
    if((req.body.oldpass != req.user.password) || (req.body.newpass!=req.body.newpassc)){
        return res.redirect('/teacher');
    }
    await Teacher.updateOne(
        { email: req.user.email },
        {
          $set: { password: req.body.newpass},
        }
    );
    return res.redirect('/teacher/logout');
};



module.exports.logout = function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
}
module.exports.nextpage=function(req,res){
    return res.render("teacherinterface");
}
module.exports.quizmaker=function(req,res){
    return res.render("quizcreatepage");
}
module.exports.addQuestion = (req, res) => {
    let id = req.query.id;
    return res.render('Question',{
        idd : id
    });
}
module.exports.addnewQuestion = (req, res) => {
    let id = req.query.id;
    const find = async()=>{
        try{
                req.body.quizid = id;
                const data = new Question(req.body);
                data.save();

                return res.render('teacherinterface'); // change to signup page later
        }
        catch(err){
            console.log(err);
        }
    }
    find();
}
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_pass){
        return res.render('Alert');
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
                return res.redirect('Alert');
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
module.exports.alert = function(req,res){
    return res.render('Alert');
}