import {Router} from "express";
import * as evaluations from '../controllers/evaluations';

const router: Router = Router();


/**
 * admin operations
 */

router.post('/', evaluations.admin.create);
router.put('/submit', evaluations.admin.submit);
router.put('/save', evaluations.admin.save);
router.delete('/:id', evaluations.admin.deleteEval);


/**
 * selectors
 */
router.get('/:id', evaluations.selector.getById);
router.get('/member/:id', evaluations.selector.getMemberStationsStatus);
router.get('/progress/term/:id', evaluations.selector.getAllStationsProgress);
router.get('/progress/term/:termId/section/:sectionId', evaluations.selector.getSectionStationsProgress);


export default router;
