'use strict';

const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');
const auth = require('../middleware/auth');

router.get('/', homeController.index);
router.get('/search/:keyword', auth.verifyToken, homeController.search);
router.get('/suggest_keyword', homeController.suggestKeyword);
router.get('/helper/address', homeController.getAddress);

module.exports = router;
