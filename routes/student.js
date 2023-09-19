const express = require('express');
const router  = express.Router();
const student_controller = require('../controller/student_controller.js');

router.get("/", student_controller.home);
router.get("/signup", student_controller.signup);
// router.post('/create',student_controller.create);
// router.post('/teacherinrt',student_controller.nextpage);

module.exports = router;