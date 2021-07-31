'use strict';

const express = require("express");
const router = express.Router();

const nurseController = require('../controllers/nurse');

router.get('/', nurseController.getAllNurse);
router.get('/:id', nurseController.getNurseById);
router.post('/:id/booking', nurseController.booking);
router.post(':id/voting', nurseController.voting);

module.exports = router;
