const express = require('express');
const router = express.Router();
const { getSubscriptionInfoBySongID } = require('../controllers/subscriptionsController');
const { getListBySearch } = require('../controllers/songsController');

router.get('/search', getListBySearch);
router.get('/:id', getSubscriptionInfoBySongID);

module.exports = router;

