'use strict';

const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const validator = require('../middleware/validator');
const healthbookController = require('../controllers/healthbook');

router.get('/', auth.verifyToken, healthbookController.getHealthbook);
router.post('/', auth.verifyToken, validator.createHealthbookValidator, healthbookController.createHealthbook);
router.get('/:id', auth.verifyToken, healthbookController.getHealthbookById);
router.put('/:id/avatar', auth.verifyToken, validator.updateAvatarValidator, healthbookController.updateAvatar);
router.put('/:id/fullname', auth.verifyToken, validator.updateFullnameValidator, healthbookController.updateFullname);
router.put('/:id/dob', auth.verifyToken, healthbookController.updateDOB);
router.put('/:id/gender', auth.verifyToken, healthbookController.updateGender);
router.put('/:id/phone', auth.verifyToken, validator.updatePhoneValidator, healthbookController.updatePhone);
router.put('/:id/address', auth.verifyToken, validator.updateAddressValidator, healthbookController.updateAddress);
router.put('/:id/health_index', auth.verifyToken, validator.updateHealthIndexValidator, healthbookController.updateHealthIndex);
router.put('/:id/symptom', auth.verifyToken, validator.updateSymptomValidator, healthbookController.updateSymptom);
router.post('/:id/save_nurse/:nurseId', auth.verifyToken, healthbookController.saveNurse);
router.post('/:id/book/:nurseId', auth.verifyToken, validator.bookingValidator, healthbookController.nurseBooking);
router.delete('/:id/book/:time_slot_id', auth.verifyToken, healthbookController.cancelBooking);
router.post('/:id/voting/:time_slot_id', auth.verifyToken, validator.votingValidator, healthbookController.nurseVoting);

module.exports = router;
