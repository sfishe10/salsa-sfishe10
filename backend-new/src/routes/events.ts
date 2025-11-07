import { Router } from 'express';
import events from '../controllers/events';

const router: Router = Router();

/**
 * admin operations
 */

router.post('/', events.admin.create);
router.put('/:id', events.admin.updateEvent);
router.delete('/:id', events.admin.delete);

/**
 * selectors
 */

router.get('/', events.selector.getAll);
router.get('/upcoming', events.selector.getUpcoming);
router.get('/recent', events.selector.getRecent);
router.get('/:id', events.selector.getById);
router.get('/:id/rosterMemberCounts', events.selector.getRosterMemberCounts);
router.get('/term/:id', events.selector.getByTermId);

export default router;
