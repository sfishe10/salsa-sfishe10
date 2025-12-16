import { Router } from 'express';
import * as attendance from '../controllers/attendance';

const router: Router = Router();

/**
 * Admin operations
 */
router.post('/', attendance.admin.create);
router.put('/:id', attendance.admin.update);
router.post('/submitForm', attendance.admin.submitForm);
router.delete('/:id', attendance.admin.delete);

/**
 * Selectors
 */
router.get('/:id', attendance.selector.getById);
router.get('/member/:id', attendance.selector.getByMemberId);
router.get('/section/:id/stats', attendance.selector.getMemberStatsBySectionId);
router.get('/event/:eventId/section/:sectionId', attendance.selector.getBySectionAndEventId);
router.get(
    '/term/:termId/section/:sectionId/eventType/:eventType',
    attendance.selector.getByTermIdAndSection
);
router.get(
    '/term/:termId/section/:sectionId/pepBand/:pepBandId',
    attendance.selector.getByTermIdAndSectionAndPepBand
);

export default router;

