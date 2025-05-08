// routes/adminBarbers.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const controller = require('../controllers/barberController');

router.use(adminAuth); // حماية كل المسارات

router.post('/', controller.createBarber);
router.get('/', controller.getBarbers);
router.patch('/:id', controller.updateBarber);
router.delete('/:id', controller.deleteBarber);
router.patch('/:id/schedule', controller.updateWorkSchedule);
router.patch('/:id/vacations', controller.updateVacations);

module.exports = router;
