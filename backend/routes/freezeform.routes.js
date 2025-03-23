const express = require('express');
const router = express.Router();

const freezeformController = require('../controllers/freezeform.controller');
const { authStudent } = require('../middlewares/auth.middleware');



router.put('/fortnightly/:period', authStudent, freezeformController.submitFortnightlyReport);
router.get('/fortnightly', authStudent, freezeformController.getFortnightlyReports);

module.exports = router