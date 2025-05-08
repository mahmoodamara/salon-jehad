const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  bookGroupAppointment, // ✅
  getAppointmentsByPhone,
  cancelAppointment,
  rescheduleAppointment,
  confirmAppointmentStatus,
  getClosestBarbers // ✅
} = require('../controllers/appointmentController');

router.post('/book', bookAppointment);
router.post('/group', bookGroupAppointment); // ✅ مسار الحجز الجماعي
router.get('/phone/:phone', getAppointmentsByPhone);
router.post('/:id/cancel', cancelAppointment);
router.post('/:id/reschedule', rescheduleAppointment);
router.patch('/:id/cancel', cancelAppointment);
router.post('/confirm-appointment/:id', confirmAppointmentStatus);
router.get('/closest-barbers', getClosestBarbers); // ✅ مسار الحلاقين القريبين

module.exports = router;
