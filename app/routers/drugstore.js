'use strict';

const express = require("express");
const router = express.Router();

const drugstoreController = require('../controllers/drugstore');

router.get('/drugstore', drugstoreController.getAllStore);
router.get('/drugstore/:id', drugstoreController.storeDetail);
router.post('/drugstore/manual_buy', drugstoreController.manualBuy);
router.post('/drugstore/auto_buy', drugstoreController.autoBuy);    

module.exports = router;
