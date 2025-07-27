const express = require('express');
const attendance = require('../attendance-controllers/attendance');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', attendance.admin.create);
router.post('/submitForm', attendance.admin.submitForm);
// router.post('/createEntries', attendance.admin.createEntries);
router.delete('/:id', attendance.admin.delete);

/**
 * selectors
 */

router.get('/member/:id', attendance.selector.getByMemberId);
router.get('/event/:eventId/section/:sectionId', attendance.selector.getBySectionAndEventId);
router.get('/term/:id/eventType/:eventType', attendance.selector.getByTermId);
router.get('/term/:termId/pepBand/:pepBandId', attendance.selector.getByTermIdAndPepBand);

module.exports = router;
