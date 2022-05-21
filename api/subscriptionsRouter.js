const express = require('express');
const router = express.Router();
const { getInfoByID } = require('../controllers/subscriptionsController');
const { getByAccountCode, getBundleByAccountCode } = require('../controllers/dbController');
const { getList } = require('../controllers/paymentsController');

router.get('/payments', getList);
router.get('/records', getByAccountCode);
router.get('/bundle-records', getBundleByAccountCode);
router.get('/:id', getInfoByID);

module.exports = router;

