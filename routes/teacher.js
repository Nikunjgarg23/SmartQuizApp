const express = require('express');
const router  = express.Router();
const passport = require('passport');
const teacher_controller = require('../controller/teacher_controller');


router.get("/", teacher_controller.home);
router.get("/alert", teacher_controller.alert);
router.get("/signup", teacher_controller.signup);
router.get("/quizmaker", teacher_controller.quizmaker);
router.get('/logout',teacher_controller.logout);
router.get('/changepassword',teacher_controller.changepassword);
router.get('/pastquiz',teacher_controller.pastquiz);
router.get('/viewquiz',teacher_controller.viewquiz);
router.get('/deletequiz',teacher_controller.deletequiz);
router.post('/changepass',passport.checkAuthentication,teacher_controller.changepass);
router.post('/createquiz',teacher_controller.createQuiz);
router.get('/addquestion',teacher_controller.addQuestion);
router.post('/addnewquestion',teacher_controller.addnewQuestion);

router.get('/sign-up',teacher_controller.signup);
router.post('/create',teacher_controller.create);
router.get('/teacherinrt',passport.checkAuthentication,teacher_controller.nextpage);

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/teacher/alert'},
),teacher_controller.createSession);

module.exports = router;