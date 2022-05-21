const express = require('express');
const router = express.Router();
const { getContinents, getRegions, getCountries, getCities, getRadiosByFilters } = require('../controllers/radiostationsController');

router.get('/continents', getContinents);
router.get('/regions', getRegions);
router.get('/countries', getCountries);
router.get('/cities', getCities);

router.get('/radiostationsByFilters', getRadiosByFilters);

module.exports = router;

