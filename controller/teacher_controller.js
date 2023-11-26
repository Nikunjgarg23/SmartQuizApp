const Teacher = require('../models/teacher');
const Quiz=require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');
const bcrypt=require('bcryptjs');
const  Configuration= require("openai");
const OpenAIApi = require("openai");
const OpenAI = require("openai");
const openaii = new OpenAI();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);




module.exports.createQuiz = (req, res) => {
    const find = async()=>{
        try{
            const user = await Quiz.findOne({quizname : req.body.quizname});

            if(!user){
                req.body.owneremail = req.user.email;
                console.log(req.user.email);
                const data = new Quiz(req.body);
                data.save();
                const user2 = await Quiz.findOne({quizname : req.body.quizname});
                console.log(user2);
                return res.redirect('/teacher/pastquiz');
            }
            else{
                return res.redirect('/teacher/');
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
        const ress = await Quiz.find({ end: 0 });
        //console.log(ress);
        return res.render('displaypastquiz',{
            title : "Available Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}

module.exports.completed = function(req,res){
    const getquiz = async ()=>{
        const ress = await Quiz.find({ end: 1 });
        return res.render('displaycompleted',{
            title : "Completed Quiz!",
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

module.exports.endquiz = async function(req,res){
    let id = req.query.id;
    await Quiz.updateOne(
        { _id : id },
        {
            $set: { end: true,
                upload : 0
            }
        }
    );
    return res.redirect('back');
};



module.exports.deleteques = function(req,res){
    let id = req.query.id;

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
    if(req.isAuthenticated() && req.user.role=='student'){
        console.log('ok');
        return res.redirect('/teacher/logout');
    }
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
    console.log(req.user);
    if((req.body.oldpass != req.user.password) || (req.body.newpass!=req.body.newpassc)){
        return res.render('Alert');
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
    // console.log(req.user);
    return res.render("quizcreatepage",{
        email : req.user.email
    });
}
module.exports.addQuestion = (req, res) => {
    let id = req.query.id;
    return res.render('Question',{
        idd:id
    });
}
module.exports.upload = (req, res) => {
    let id = req.query.id;
    const getquiz = async ()=>{
        try{
        const ress = await Quiz.findOne({_id : id});
        var fla;
        if(ress.upload){
            fla = false;
        }
        else{
            fla = true;
        }
        await Quiz.updateOne(
            { _id: id },
            {
              $set: { upload : fla},
            }
        );
        return res.redirect('/teacher/pastquiz');
        }catch(err){
            console.log(err);
            return ;
        }
    }
    getquiz();

}
module.exports.addnewQuestion = (req, res) => {
    let id = req.query.id;
    const find = async()=>{
        try{
                req.body.quizid = id;
                const data = new Question(req.body);
                data.save();

                return res.redirect('/teacher/pastquiz'); // change to signup page later
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
            console.log(user);
            if(!user || user.role!="teacher"){
                // req.body.role="teacher";
                // const data = new Teacher(req.body);
                // data.save();
                // console.log(data);
                const salt=await bcrypt.genSalt(10);
                // const salt="Azbe";
                // const pass=await bcrypt.hash(req.body.password,salt);
                let pass=await bcrypt.hash(req.body.password,salt);
                let rol="teacher";
                Teacher.create({
                    email:req.body.email,
                    password:pass,
                    name:req.body.name,
                    role:rol
                })
                console.log("Areeee");
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

module.exports.addbatch = async function(req,res){
    let id = req.query.id;
    const arr = [];
    if(req.body.batch1!=undefined){
        arr.push("F1");
    }
    if(req.body.batch2!=undefined){
        arr.push("F2");
    }
    if(req.body.batch3!=undefined){
        arr.push("F3");
    }
    console.log(arr);
    await Quiz.updateOne(
        { _id : id },
        {
            $set: { batches: arr }
        }
    );
    return res.redirect('back');
}

module.exports.createSession = function(req,res){
    return res.redirect('/teacher/teacherinrt');
}
module.exports.evaluate = function(req,res){
    async function eval() {
        const completion = await openaii.chat.completions.create({
          messages: [{ role: "system", content: "You are a helpful assistant." }
        ,{role:"assistant",content:"What can I do for you today?"},
        {role:"user",content:"compare two answers provide me a score on a value ranges from 0 to 10"},
        {role:"assistant",content:"Ok! give me Answer1 "},
        {role:"user",content:"Ram is a good boy"},
        {role:"assistant",content:" give me Answer2 "},
        {role:"user",content:"ram is fine boy"},
        {role:"user",content:"now compare give me a score"},
      ],
          model: "gpt-3.5-turbo",
        });
      
        console.log(completion.choices[0]);
      }
      
      eval();
}
module.exports.alert = function(req,res){
    return res.render('Alert');
}
module.exports.alert2 = function(req,res){
    return res.redirect('back');
}