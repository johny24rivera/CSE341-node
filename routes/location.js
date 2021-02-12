const path = require('path');

const express = require('express');

const locationController = require('../controllers/location');

const router = express.Router();

router.get('/location', locationController.getLocation);

module.exports = router;