const express = require('express');
const { verifyAuthUser, getInfoByEmail, getMusicInfoByEmail } = require('../controllers/usersController');
const { getAccountById } = require('../controllers/paymentsController');
const router = express.Router();
const auth = require('../middleware/auth');


router.post('/', auth.verifyUser, verifyAuthUser);
router.get('/data', getMusicInfoByEmail);
router.get('/:accountCode', getAccountById);
router.get('/', getInfoByEmail);

module.exports = router;

