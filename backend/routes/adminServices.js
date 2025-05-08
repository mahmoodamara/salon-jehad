// routes/adminServices.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const controller = require('../controllers/serviceController');

router.use(adminAuth); // حماية المسارات

router.post('/', controller.createService);
router.get('/', controller.getServices);
router.patch('/:id', controller.updateService);
router.delete('/:id', controller.deleteService);

module.exports = router;
