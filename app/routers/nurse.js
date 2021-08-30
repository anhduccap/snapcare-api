'use strict';

const express = require("express");
const router = express.Router();

const nurseController = require('../controllers/nurse');
const auth = require('../middleware/auth');

router.post('/', nurseController.createNurse);
router.get('/', auth.verifyToken, auth.verifyHealthbook, nurseController.getNurse);
router.get('/:id', auth.verifyToken, auth.verifyHealthbook, nurseController.getNurseById);
router.post('/:id/create_time_slot', auth.verifyToken, nurseController.createTimeSlot);
router.get('/:id/available_time', auth.verifyToken, nurseController.getAvailableTime);

module.exports = router;
