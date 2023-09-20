const express = require('express');
const router  = express.Router();
const passport = require('passport');
const teacher_controller = require('../controller/teacher_controller');

router.get("/", teacher_controller.home);
router.get("/signup", teacher_controller.signup);
router.post("/quizmaker", teacher_controller.quizmaker);
router.post('/createquiz',teacher_controller.createQuiz);

router.get('/sign-up',teacher_controller.signup);
router.post('/create',teacher_controller.create);
router.get('/teacherinrt',passport.checkAuthentication,teacher_controller.nextpage);

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/teacher/'},
),teacher_controller.createSession);

module.exports = router;