const express = require('express');
const attendance = require('../attendance-controllers/attendance');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', attendance.admin.create);
router.put('/:id', attendance.admin.update);
router.post('/submitForm', attendance.admin.submitForm);
// router.post('/createEntries', attendance.admin.createEntries);
router.delete('/:id', attendance.admin.delete);

/**
 * selectors
 */

router.get('/:id', attendance.selector.getById);
router.get('/member/:id', attendance.selector.getByMemberId);
router.get('/section/:id/stats', attendance.selector.getMemberStatsBySectionId);
router.get('/event/:eventId/section/:sectionId', attendance.selector.getBySectionAndEventId);
router.get('/term/:termId/section/:sectionId/eventType/:eventType', attendance.selector.getByTermIdAndSection);
router.get('/term/:termId/section/:sectionId/pepBand/:pepBandId', attendance.selector.getByTermIdAndSectionAndPepBand);

module.exports = router;
