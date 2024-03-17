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




const openai = new OpenAIApi(configuration);
module.exports.createQuiz = (req, res) => {
    const find = async () => {
        try {
            const user = await Quiz.findOne({ quizname: req.body.quizname });

            if (1) {
                // console.log(req.user);
                req.body.owneremail = req.user.email;
                req.body.owner = req.user.name;
                // console.log(req.user.email);
                const data = new Quiz(req.body);
                data.save();
                return res.redirect('/teacher/pastquiz');
            }
            else {
                return res.redirect('/teacher/');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    find();
}
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'keshavmantry01@gmail.com', // Your Gmail address
        pass: 'bwxy yddi doib neri' // Your Gmail password
    }
});


// Add a new function in teacher_controller.js to handle OTP verification
module.exports.verifyOTP = function (req, res) {
    try {
        const otp = req.body.otp;
        if (otp === req.session.otp) {
            // If OTP is correct, clear the OTP session variable and redirect to login page
            req.session.otp = null;



            const find = async () => {
                // console.log(gpassword);
                try {
                    const user = await Teacher.findOne({ email: gemail });
                    if (!user || user.role != "teacher") {
                        // console.log("p1pp");
                        const salt = await bcrypt.genSalt(10);

                        // console.log("ppp");
                        let pass = await bcrypt.hash(gpassword, salt);
                        // console.log("pp2p");
                        let rol = "teacher";
                        Teacher.create({
                            email: gemail,
                            password: pass,
                            name: gname,
                            role: grol
                        })
                        // console.log("pp3p");

                        return res.redirect('/teacher'); // change to signup page later
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

            // return res.redirect('/teacher'); // Redirect to login page

        } else {
            return res.render('Alert', { message: 'Invalid OTP' });
        }
    } catch (err) {
        console.log(err);
        return res.render('Alert', { message: 'Error verifying OTP' });

    }



};




module.exports.pastquiz = function (req, res) {
    const getquiz = async () => {
        //const ress = await Quiz.find({ end: 0 });
        const ress = await Quiz.find({ end: 0, owneremail: req.user.email });
        //console.log(ress);
        //console.log(ress[1].attempted.length);
        return res.render('displaypastquiz', {
            title: "Available Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}
module.exports.test = function (req, res) {
    return res.render('Question2');
}
module.exports.completed = function (req, res) {
    const getquiz = async () => {
        const ress = await Quiz.find({ end: 1, owneremail: req.user.email });
        return res.render('displaycompleted', {
            title: "Completed Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}


module.exports.viewquiz = function (req, res) {
    let id = req.query.id;
    const getquiz = async () => {
        const ress = await Question.find({ quizid: id });
        //console.log(ress);
        return res.render('viewquiz', {
            title: "Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}
module.exports.viewquizcompleted = function (req, res) {
    let id = req.query.id;
    const getquiz = async () => {
        const ress = await Question.find({ quizid: id });
        //console.log(ress);
        return res.render('viewquizcompleted', {
            title: "Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}

module.exports.evaluate = async function (req, res) {
    console.log("kkp");
    let id = req.query.id; // quizid
    const getstu = async () => {
        const ques = await Question.find({ quizid: id });
        for (const que of ques) {
            console.log(que.questionText);
            async function eval() {
                let ans11 = "";
                var ans1 = "";
                // const completion = await openaii.chat.completions.create({
                //     messages: [{ role: "system", content: "You are a helpful assistant." }
                //         , { role: "assistant", content: "What can I do for you today?" },
                //     { role: "user", content: "Translate this Hinglish Ans into English" },
                //     { role: "assistant", content: "Ok! give me Hinglish ans" },
                //     { role: "user", content: que.questionAnswer },
                //     ],
                //     model: "gpt-3.5-turbo",
                // });
                // var result = JSON.parse(JSON.stringify(completion));

                ans1 = que.questionAnswer;
                // console.log(result);
                // ans11 = (res.message.content);
                console.log(ans1);
                for (const re of que.response) {
                    // console.log("kkkkk");
                    // console.log(re.answer);
                    async function evalans() {
                        const completion1 = await openaii.chat.completions.create({
                            messages: [{ role: "system", content: "You are a helpful assistant." }
                                , { role: "assistant", content: "What can I do for you today?" },
                            { role: "user", content: "strictly compare answer2 with main asnwer1 and rate the answer2 only on a scale ranges from 0 to 5 based on your understanding of comparions" },
                            { role: "assistant", content: "Ok! give me the main Answer1 " },
                            { role: "user", content: ans1 },
                            { role: "assistant", content: " give me Answer2 " },
                            { role: "user", content: re.answer },
                            { role: "user", content: "Important Note You have to do very strict comparison and provide me a statement in this form : 'I would like to give (your_comparison_based_marks) out of 5' " },
                            ],
                            model: "gpt-3.5-turbo",
                        });
                        console.log(completion1.choices[0]);
                        let resultstring = completion1.choices[0];
                        let resultint = resultstring.message.content;
                        //let resultint = '5';
                        // console.log(resultint.length);
                        let num = '4';
                        if (resultint.length > 2) {
                            let ind = resultint.indexOf("out");
                            while (ind >= 0) {
                                if (resultint[ind] >= '0' && resultint[ind] <= '9') {
                                    if (ind >= 1 && resultint[ind] === '0') {
                                        if (resultint[ind - 1] == '1')
                                            num = '1';
                                        num += '0';
                                    }
                                    else
                                        num = resultint[ind];
                                    break;
                                }
                                ind = ind - 1;
                            }
                            //var match = resultint.match(/\d+/);
                            resultint = parseInt(num);
                            console.log("result : ");
                            console.log(resultint);
                        }
                        else
                            resultint = parseInt(resultint);
                        const stuid = re.stu_id;
                        const number = resultint;
                        const updatedUser = await Teacher.findOneAndUpdate(
                            { _id: stuid, 'score.quiz_id': id },
                            { $inc: { 'score.$.fscore': number } },
                            { new: true });

                        const query = { _id: que._id, "response.stu_id": stuid }; // Find the document by question ID and student ID
                        const update = { $set: { "response.$.score": number } };
                        const updatedQuestion = await Question.findOneAndUpdate(query, update, { new: true });
                        console.log(`Score updated successfully for student with ID ${stuid} in question with ID ${que._id}.`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 18000));
                    await evalans();
                }
            }
            await eval();
        }
        await Quiz.updateOne({ _id: id }, {
            $set: { iseval: true }
        });
        return res.redirect('back');
    }
    getstu();
}

module.exports.viewstures = function (req, res) {
    //let id = req.query.id;
    const id = req.query.quizid;
    const getquiz = async () => {
        try {
            const questions = await Question.find({ quizid: id });
            const desiredStudentId = req.query.id;
            let questionsWithAnswers = [];
            //console.log("ok");
            //console.log(desiredStudentId);
            for (const question of questions) {
                //console.log(question);
                const answerForStudent = await question.response.find(response => response.stu_id === desiredStudentId);
                //console.log(answerForStudent);
                const questionWithAnswer = {
                    questionText: question.questionText,
                    questionAnswer: question.questionAnswer,
                    studentAnswer: answerForStudent ? answerForStudent.answer : 'No answer found for this student',
                    score : answerForStudent?(answerForStudent.score?answerForStudent.score:"0"):"0"
                };

                // Push the object to the array
                questionsWithAnswers.push(questionWithAnswer);
            }

            return res.render('viewstures', {
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


module.exports.viewres = async function (req, res) {
    // // student id , quesion text , bacche ans
    // //  loop bacche
    // // bache score == 0&(()) 
    // async function eval() {
    //     let ans11 = "";
    //     var ans1 = "";
    //     const completion = await openaii.chat.completions.create({
    //         messages: [{ role: "system", content: "You are a helpful assistant." }
    //             , { role: "assistant", content: "What can I do for you today?" },
    //         { role: "user", content: "Generate the answer for this question" },
    //         { role: "assistant", content: "Ok! give me Question" },
    //         { role: "user", content: "what is the Formula of (a+b)^2" },
    //         ],
    //         model: "gpt-3.5-turbo",
    //     });
    //     //var result = JSON.parse(JSON.stringify(completion));
    //     ans1 = completion.choices[0];
    //     ans11 = (ans1.message.content);


    // }
    // eval();
    // // console.log("here");
    // // console.log(ans11);
    let id = req.query.id;
    const studentsData = await Teacher.find({
        role: 'student',
        'score.quiz_id': id
    }, 'name batch score.$');

    // Extract relevant data and create an array of objects
    const ress1 = studentsData.map(student => ({
        name: student.name,
        _id:student._id,
        batch: student.batch,
        score: student.score.find(item => item.quiz_id === id).fscore
    }));
    console.log(ress1);

    // const studentsData2 = await Teacher.find({
    //     role: 'student',
    //     batch: 'F2',
    //     'score.quiz_id': id
    // }, 'name batch score.$');

    // // Extract relevant data and create an array of objects
    // const ress2 = studentsData2.map(student => ({
    //     name: student.name,
    //     batch: student.batch,
    //     score: student.score.find(item => item.quiz_id === id).fscore
    // }));

    // const studentsData3 = await Teacher.find({
    //     role: 'student',
    //     batch: 'F3',
    //     'score.quiz_id': id
    // }, 'name batch score.$');

    // // Extract relevant data and create an array of objects
    // const ress3 = studentsData3.map(student => ({
    //     name: student.name,
    //     batch: student.batch,
    //     score: student.score.find(item => item.quiz_id === id).fscore
    // }));
    return res.render('Viewrponse', {
        title: "Quiz!",
        student1: ress1,
        quizid: id
    });

}


// module.exports.viewstures = async function (req, res) {
//     const id = req.query.id;
//     const quizidd = req.query.quizid;
//     try {
//         const result = await Question.findOne(
//             { quizid: quizidd, 'response.stu_id': id },
//             { questionText: 1, response: 1 }
//         );
//         console.log(result);

//         if (result) {
//             const { questionText, responses } = result;

//             const studentResponse = responses.find((response) => response.stu_id === stuId);

//             // res.render('viewstures', {
//             //     title: 'Question and Answer',
//             //     questionText,
//             //     studentResponse: studentResponse ? studentResponse.answer : 'Student did not answer'
//             // });
//             return res.render('viewquizcompletedstudent', {
//                 title: "Quiz!",
//                 past_quiz: questionsWithAnswers
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching question and answer:', error);
//     }
//     return res.redirect('back');
// }


module.exports.deletequiz = function (req, res) {
    let id = req.query.id;
    // let contind = contactList.findIndex(contact => contact.number==phone);
    // if(contind!=-1){
    //     contactList.splice(contind,1);
    // }
    const dele = async () => {
        try {
            const ress = await Quiz.deleteOne({ _id: id });
            return res.redirect('back');
        } catch (err) {
            console.log(err);
            return;
        }
    }
    dele();
};

module.exports.endquiz = async function (req, res) {
    let id = req.query.id;
    await Quiz.updateOne(
        { _id: id },
        {
            $set: {
                end: true,
                upload: 0
            }
        }
    );
    return res.redirect('back');
};



module.exports.deleteques = function (req, res) {
    let id = req.query.id;

    const dele = async () => {
        try {
            const ress = await Question.deleteOne({ _id: id });
            return res.redirect('back');
        } catch (err) {
            console.log(err);
            return;
        }
    }
    dele();
};

module.exports.home = function (req, res) {
    if (req.isAuthenticated() && req.user.role == 'student') {
        console.log('ok');
        return res.redirect('/teacher/logout');
    }
    if (req.isAuthenticated()) {
        return res.redirect('/teacher/pastquiz');
    }
    else if (!req.isAuthenticated) {
        return res.render('Alert');
    }
    else
        return res.render("teacher-signup");
}

module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/teacher/pastquiz');
    }
    return res.render("Alert");
}
module.exports.changepassword = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect('Alert');
    }

    return res.render("changepass");
}

module.exports.changepass = async function (req, res) {
    console.log(req.user);
    // const salt="Azbe";
    // const pass=await bcrypt.hash(req.body.password,salt);
    const passcompare = await bcrypt.compare(req.body.oldpass, req.user.password);
    // console.log(passcompare);
    // console.log(req.user.password);
    // console.log(req.body.oldpass);
    // console.log(passcompare);
    if ((!passcompare) || (req.body.newpass != req.body.newpassc)) {
        return res.render('Alert');
    }
    const salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(req.body.newpass, salt);
    await Teacher.updateOne(
        { email: req.user.email },
        {
            $set: { password: pass },
        }
    );
    return res.redirect('/teacher/logout');
};



module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
module.exports.nextpage = function (req, res) {
    return res.render("teacherinterface");
}
module.exports.quizmaker = function (req, res) {
    // console.log(req.user);
    return res.render("quizcreatepage", {
        email: req.user.email
    });
}
module.exports.addQuestion = (req, res) => {
    let id = req.query.id;
    const getquiz = async () => {
        const ress = await Question.find({ quizid: id });
        //console.log(ress);
        // return res.render('viewquiz', {
        //     title: "Quiz!",
        //     past_quiz: ress
        // });
        return res.render('Question2', {
            idd: id,
            past_quiz: ress
        });
    }
    getquiz();
    // return res.render('Question', {
    //     idd: id
    // });
}
module.exports.upload = (req, res) => {
    let id = req.query.id;
    const getquiz = async () => {
        try {
            const ress = await Quiz.findOne({ _id: id });
            var fla;
            if (ress.upload) {
                fla = false;
            }
            else {
                fla = true;
            }
            await Quiz.updateOne(
                { _id: id },
                {
                    $set: { upload: fla },
                }
            );
            let quiztime = 0;
            if (req.body.timer !== undefined)
                quiztime = req.body.timer;
            await Quiz.updateOne(
                { _id: id },
                {
                    // $set: { batches: arr },
                    $set: { time: quiztime }
                }
           
            );
    return res.redirect('/teacher/pastquiz');
} catch (err) {
    console.log(err);
    return;
}
    }
getquiz();

}
module.exports.addnewQuestion = (req, res) => {
    let id = req.query.id;
    const find = async () => {
        try {
            // console.log(req.body);
            req.body.quizid = id;
            // let ans1 = "";
            // const completion = await openaii.chat.completions.create({
            //     messages: [{ role: "system", content: "You are a helpful assistant." },
            //         { role: "assistant", content: "What can I do for you today?" },
            //         { role: "user", content: "Translate this Hinglish Ans into English" },
            //         { role: "assistant", content: "Ok! give me Hinglish ans" },
            //         { role: "user", content: req.body.questionAnswer },
            //     ],
            //     model: "gpt-3.5-turbo",
            // });
            // const result = JSON.parse(JSON.stringify(completion));
            // ans1 = result.choices[0].message.content; // Extract the generated answer
            // console.log(ans1);
            
            // Save the question along with the generated answer
            const data = new Question({
                ...req.body,
                //questionAnswer: ans1 // Save the generated answer
            });
            await data.save(); // Wait for the data to be saved

            return res.redirect(`/teacher/addquestion/?id=${id}`);
        } catch (err) {
            console.log(err);
        }
    };
    find();
};

// Function to generate OTP
function generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

// Modify the create function to include OTP sending
module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_pass) {
        return res.render('Alert');
    }
    const find = async () => {
        try {
            const user = await Teacher.findOne({ email: req.body.email });
            if (!user || user.role !== "teacher") {
                const salt = await bcrypt.genSalt(10);
                // let pass = await bcrypt.hash(req.body.password, salt);
                let rol = "teacher";
                grol = rol;
                gemail = req.body.email;
                gname = req.body.name;
                gpassword = req.body.password;
                console.log(req.body.password);
                // Generate OTP
                let otp = generateOTP();
                // Send OTP via email
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
                        return res.redirect('otp'); // Redirect to OTP verification page
                    }
                });
            } else {
                return res.redirect('/teacher/alert');
            }
        } catch (err) {
            console.log(err);
            return res.render('Alert');
        }
    }
    find();
};

module.exports.addbatch = async function (req, res) {
    let id = req.query.id;
    const arr = [];
    let quiztime = 0;
    if (req.body.timer !== undefined)
        quiztime = req.body.timer;
    if (req.body.batch1 != undefined) {
        arr.push("F1");
    }
    if (req.body.batch2 != undefined) {
        arr.push("F2");
    }
    if (req.body.batch3 != undefined) {
        arr.push("F3");
    }
    console.log(arr);
    await Quiz.updateOne(
        { _id: id },
        {
            $set: { batches: arr },
            // $set:{time:quiztime}
        }
    );
    await Quiz.updateOne(
        { _id: id },
        {
            // $set: { batches: arr },
            $set: { time: quiztime }
        }
    );
    return res.redirect('back');
}

module.exports.createSession = function (req, res) {
    return res.redirect('/teacher/pastquiz');
}


module.exports.alert = function (req, res) {
    return res.render('Alert');
}
module.exports.alert2 = function (req, res) {
    return res.redirect('back');
}
// Import your Teacher model

