const express = require('express');
const { sendTestMsg } = require('../controllers/testController');
const router = express.Router();


router.get('/', sendTestMsg);

module.exports = router;

