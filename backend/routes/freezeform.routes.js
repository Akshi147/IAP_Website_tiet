const express = require('express');
const router = express.Router();

const freezeformController = require('../controllers/freezeform.controller');
const { authStudent, authAdmin } = require('../middlewares/auth.middleware');



router.put('/fortnightly/:period', authStudent, freezeformController.submitFortnightlyReport);
router.get('/fortnightly', authStudent, freezeformController.getFortnightlyReports);
router.post('/fortnightly/student',authAdmin, freezeformController.getFortnightlyReportsForStudent);
router.patch('/fortnightly/:reportId', authAdmin,freezeformController.updateReportStatus);

module.exports = router