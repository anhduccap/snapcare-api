'use strict';

const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');

router.get('/', homeController.index);
router.get('/search', homeController.search);
router.get('/suggest_keyword', homeController.suggestKeyword);

module.exports = router;
