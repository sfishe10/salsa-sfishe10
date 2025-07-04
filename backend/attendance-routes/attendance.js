const express = require('express');
const attendance = require('../attendance-controllers/attendance');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', attendance.admin.create);
router.post('/submitForm', attendance.admin.submitForm);
router.post('/createEntries', attendance.admin.createEntries);
router.delete('/:id', attendance.admin.delete);

/**
 * selectors
 */

router.get('/', attendance.selector.getAttendances);

module.exports = router;
