const express = require('express');
const router  = express.Router();

const homeController = require('../controller/home_controller');

router.get('/',homeController.home);
router.post('/forgotpassword',homeController.forgot);
router.get('/forgotpassword',homeController.forgot);
router.post('/verifypassword',homeController.verifypassword);
router.post('/reset_password',homeController.resetpass);
router.get('/forgot', function(req, res) {
    res.render('Forgotpassword'); // Remove the forward slash from '/otp'
});
router.use('/teacher',require('./teacher'));
router.use('/student',require('./student'));

module.exports = router; 