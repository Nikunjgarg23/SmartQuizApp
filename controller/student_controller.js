// const Student = require('../models/student');

const Student = require('../models/teacher');
const Quiz = require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');
const { model } = require('mongoose');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher');
const Configuration = require("openai");
const OpenAIApi = require("openai");
const OpenAI = require("openai");
const openaii = new OpenAI();
const configuration = new Configuration({


    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
module.exports.home = function (req, res) {
    if (req.isAuthenticated() && req.user.role == 'teacher') {
        console.log('ok');
        return res.redirect('/teacher/logout');
    }
    if (req.isAuthenticated()) {
        return res.redirect('/student/studentinrt');
    }
    else if (!req.isAuthenticated) {
        return res.render('Alert');
    }
    else
        return res.render("studentlogin");
}

module.exports.signup = function (req, res) {
    return res.render("studentlogin");
}
module.exports.livequiz = function (req, res) {
    //return res.render("playquiz");
    console.log("livee");
    let id = req.query.id;
    console.log(req.user.id);

    const getquiz = async () => {
        try {
            const ress = await Question.find({ quizid: id });
            const res2 = await Quiz.findOne({ _id: id });
            // const result = await Teacher.updateOne(
            //     { _id: req.user.id },
            //     {
            //         $push: {
            //             score: {
            //                 quiz_id: id,
            //                 fscore : 0
            //             }
            //         }
            //     }
            // );
            // await Quiz.updateOne(
            //     {_id:id},
            //     {
            //         $push:{
            //             attempted:req.user.id
            //         }
            //     }
            // )
            return res.render('playquiz', {
                past_quiz: ress,
                quizname: res2.quizname,
                timer: res2.time
            }
            );
        } catch (err) {
            console.log(err);
            return;
        }
    }
    getquiz();
}

module.exports.livequiz2 = function (req, res) {
    //return res.render("playquiz");
    console.log("livee2");
    let id = req.query.id;
    console.log(req.user.id);

    const getquiz = async () => {
        try {
            // const ress = await Question.find({quizid : id});
            // const res2 = await Quiz.findOne({_id:id});
            const result = await Teacher.updateOne(
                { _id: req.user.id },
                {
                    $push: {
                        score: {
                            quiz_id: id,
                            fscore: 0
                        }
                    }
                }
            );
            await Quiz.updateOne(
                { _id: id },
                {
                    $push: {
                        attempted: req.user.id
                    }
                }
            )
            return res.redirect(`/student/displaylive/?id=${id}`);
            // return res.render('playquiz',{
            //     past_quiz:ress,
            //     quizname:res2.quizname,
            //     timer:res2.time
            // }
            //);
        } catch (err) {
            console.log(err);
            return;
        }
    }
    getquiz();
}

module.exports.nextpage = function (req, res) {
    return res.render("studentinterface");
}

module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

module.exports.displaycompleted = function (req, res) {
    //console.log(req.user);
    const stuid = req.user._id;
    const getquiz = async () => {
        // { end: true, attempted: stuid }
        const ress = await Quiz.find({ attempted: stuid });
        return res.render('studentcompleted', {
            title: "Attempted Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}

module.exports.viewquiz = function (req, res) {
    var batch = req.user.batch;

    console.log(batch);
    const getquiz = async () => {
        const ress = await Quiz.find({
            $and: [
                { upload: true },
                // { batches: {$in:[batch]} },
                { 'attempted': { $nin: [req.user.id] } }
            ]
        });

        //const ress = await Quiz.find({ upload: true, batches: { $in: [batch] } });
        //console.log(ress);
        return res.render('viewquizstudent', {
            title: "Ongoing Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}

module.exports.viewquizcompleted = function (req, res) {
    let id = req.query.id;

    const getquiz = async () => {
        try {
            const questions = await Question.find({ quizid: id });
            const desiredStudentId = req.user._id.toString();
            let questionsWithAnswers = [];
            //console.log(desiredStudentId);
            for (const question of questions) {
                //console.log(question);
                const answerForStudent = await question.response.find(response => response.stu_id === desiredStudentId);
                //console.log(answerForStudent);
                const questionWithAnswer = {
                    questionText: question.questionText,
                    questionAnswer: question.questionAnswer,
                    studentAnswer: answerForStudent ? answerForStudent.answer : 'No answer found for this student'
                };

                // Push the object to the array
                questionsWithAnswers.push(questionWithAnswer);
            }

            return res.render('viewquizcompletedstudent', {
                title: "Quiz!",
                past_quiz: questionsWithAnswers
            });
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    getquiz();
}

module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_pass) {
        return res.redirect('back');
    }
    const find = async () => {
        try {
            const user = await Student.findOne({ email: req.body.email });

            if (!user || user.role != "student") {
                req.body.role = "student";
                console.log(req.body);
                const data = new Student(req.body);
                const salt = await bcrypt.genSalt(10);
                let pass = await bcrypt.hash(req.body.password, salt);
                // let rol="teacher";
                Student.create({
                    email: req.body.email,
                    password: pass,
                    name: req.body.name,
                    batch: req.body.batch
                })
                //data.save();
                console.log("data");
                console.log("I am Here");
                return res.redirect('/student');
            }
            else {
                return res.redirect('Alert');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    find();
};
module.exports.saveanswer = async function (req, res) {
    console.log("savee");
    console.log(req.body);
    console.log(req.user.id);
    try {
        const { questionId, answer } = req.body;
        var f = 0;
        if (!questionId) {
            return res.redirect('/student');
        }
       
        for (let i = 0; i < questionId.length; i++) {
            const currentQuestionId = questionId[i];
            if (currentQuestionId >= 0 && currentQuestionId < 10) { f = 1; break; }
            console.log(currentQuestionId)
            const currentAnswer = answer[i];
            const studentId = req.user.id;
            let ans1 = "";
            const completion = await openaii.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant." },
                    { role: "assistant", content: "What can I do for you today?" },
                    { role: "user", content: "Translate this Hinglish Ans into English" },
                    { role: "assistant", content: "Ok! give me Hinglish ans" },
                    { role: "user", content: currentAnswer},
                ],
                model: "gpt-3.5-turbo",
            });
            const result1 = JSON.parse(JSON.stringify(completion));
            ans1 = result1.choices[0].message.content; // Extract the generated answer
            console.log(ans1);
            const result = await Question.updateOne(
                { _id: currentQuestionId },
                {
                    $push: {
                        response: {
                            stu_id: studentId,
                            answer: ans1
                        }
                    }
                }
            );
        }
        if (f == 1) {
            const currentQuestionId = questionId;
            console.log(currentQuestionId)
            const currentAnswer = answer;
            console.log(currentAnswer);
            let ans1 = "";
            const completion = await openaii.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant." },
                    { role: "assistant", content: "What can I do for you today?" },
                    { role: "user", content: "Translate this Hinglish Ans into English" },
                    { role: "assistant", content: "Ok! give me Hinglish ans" },
                    { role: "user", content: currentAnswer},
                ],
                model: "gpt-3.5-turbo",
            });
            const result1 = JSON.parse(JSON.stringify(completion));
            ans1 = result1.choices[0].message.content; // Extract the generated answer
            console.log(ans1);
            const studentId = req.user.id;
            const result = await Question.updateOne(
                { _id: currentQuestionId },
                {
                    $push: {
                        response: {
                            stu_id: studentId,
                            answer: ans1
                        }
                    }
                }
            );
        }

    } catch (error) {
        console.error('Error submitting quiz:', error);
    }
    return res.redirect('/student');
}
module.exports.createSession = function (req, res) {
    return res.redirect('/student/studentinrt');
}
module.exports.changepassword = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect('Alert');
    }
    return res.render("Studentchangepassword");
}