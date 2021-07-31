'use strict';

const express = require("express");
const router = express.Router();

const clinicController = require('../controllers/clinic');

router.get('/clinic', clinicController.getAllClinic);
router.get('/clinic/:id', clinicController.getClinicById);
router.post('/clinic/:id/booking', clinicController.booking);   

module.exports = router;
