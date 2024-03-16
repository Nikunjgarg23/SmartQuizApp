const express = require('express');
const router  = express.Router();
const passport = require('passport');
const teacher_controller = require('../controller/teacher_controller');


router.get("/", teacher_controller.home);
router.get("/alert", teacher_controller.alert);
router.get("/alert2", teacher_controller.alert2);
router.get("/signup", teacher_controller.signup);
router.get("/quizmaker",passport.checkAuthentication, teacher_controller.quizmaker);
router.get('/logout',teacher_controller.logout);
router.get('/changepassword',passport.checkAuthentication,teacher_controller.changepassword);
router.get('/pastquiz',passport.checkAuthentication,teacher_controller.pastquiz);
router.get('/viewquiz',passport.checkAuthentication,teacher_controller.viewquiz);
router.get('/viewquizcompleted',passport.checkAuthentication,teacher_controller.viewquizcompleted);
router.get('/viewres',passport.checkAuthentication,teacher_controller.viewres);
router.get('/eval',teacher_controller.evaluate);
router.get('/deletequiz',passport.checkAuthentication,teacher_controller.deletequiz);
router.get('/endquiz',passport.checkAuthentication,teacher_controller.endquiz);
router.get('/completed',passport.checkAuthentication,teacher_controller.completed);
router.get('/deleteques',passport.checkAuthentication,teacher_controller.deleteques);
router.post('/changepass',passport.checkAuthentication,teacher_controller.changepass);
router.post('/createquiz',passport.checkAuthentication,teacher_controller.createQuiz);
router.get('/addquestion',passport.checkAuthentication,teacher_controller.addQuestion);
router.post('/upload',teacher_controller.upload);
router.post('/addnewquestion',passport.checkAuthentication,teacher_controller.addnewQuestion);
router.get('/test',teacher_controller.test);
router.get('/viewres',passport.checkAuthentication,teacher_controller.viewres)
router.post('/verifyOTP',teacher_controller.verifyOTP);
 router.get('/sign-up',teacher_controller.signup);
 


router.get('/otp', function(req, res) {
    res.render('otp'); // Remove the forward slash from '/otp'
});


router.post('/create',teacher_controller.create);
router.post('/addbatch',teacher_controller.addbatch);
router.get('/teacherinrt',passport.checkAuthentication,teacher_controller.nextpage);


router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/teacher/alert'},
),teacher_controller.createSession);

module.exports = router;