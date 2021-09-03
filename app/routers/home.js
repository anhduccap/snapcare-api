'use strict';

const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');
const auth = require('../middleware/auth');

router.get('/', homeController.index);
router.get('/search/history', auth.verifyToken, homeController.searchingHistory);
router.get('/helper/address', homeController.getAddress);

module.exports = router;
