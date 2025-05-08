// routes/adminAppointments.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const controller = require('../controllers/adminAppointmentController');

router.use(adminAuth); // حماية كاملة للمسارات

router.get('/', controller.getAllAppointments);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
