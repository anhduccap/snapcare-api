'use strict';

const express = require("express");
const router = express.Router();

const healthbookController = require('../controllers/healthbook');

router.get('/:userId/healthbook', healthbookController.getHealthbookByUserId);


module.exports = router;
