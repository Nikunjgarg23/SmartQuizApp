const express = require('express');
const router  = express.Router();
const teacher_controller = require('../controller/teacher_controller');

router.get("/", teacher_controller.home);
router.get("/signup", teacher_controller.signup);

router.get('/sign-up',teacher_controller.signup);
router.post('/create',teacher_controller.create);
router.post('/teacherinrt',teacher_controller.nextpage);

module.exports = router;