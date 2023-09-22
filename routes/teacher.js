const express = require('express');
const router  = express.Router();
const passport = require('passport');
const teacher_controller = require('../controller/teacher_controller');

router.get("/", teacher_controller.home);
router.get("/signup", teacher_controller.signup);
router.get("/quizmaker", teacher_controller.quizmaker);
router.get('/logout',teacher_controller.logout);
router.post('/createquiz',teacher_controller.createQuiz);
router.post('/addquestion',teacher_controller.addQuestion);

router.get('/sign-up',teacher_controller.signup);
router.post('/create',teacher_controller.create);
router.get('/teacherinrt',passport.checkAuthentication,teacher_controller.nextpage);

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/teacher/'},
),teacher_controller.createSession);

module.exports = router;