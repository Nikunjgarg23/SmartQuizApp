const express = require('express');
const router  = express.Router();

const homeController = require('../controller/home_controller');

router.get('/',homeController.home);
router.use('/teacher',require('./teacher'));
module.exports = router; 