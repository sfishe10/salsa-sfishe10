const express = require('express');
const attendance = require('../attendance-controllers/attendance');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', attendance.admin.create);
// router.put('/:id', attendance.admin.update);
// router.delete('/:id', attendance.admin.delete);

/**
 * selectors
 */

module.exports = router;
