const express = require('express');
const router = express.Router();
const { getInvoicesList } = require('../controllers/invoicesController');

router.get('/:accountCode', getInvoicesList);

module.exports = router;

