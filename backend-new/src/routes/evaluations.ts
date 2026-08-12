import {Router} from "express";
import * as evaluations from '../controllers/evaluations';
import {getAllStationsProgress, getSectionStationsProgress} from "../controllers/evaluations/selector";

const router: Router = Router();


/**
 * admin operations
 */

router.post('/', evaluations.admin.create);
router.put('/submit', evaluations.admin.submit);


/**
 * selectors
 */
router.get('/:id', evaluations.selector.getById);
router.get('/member/:id', evaluations.selector.getMemberStationsStatus);
router.get('/progress/term/:id', evaluations.selector.getAllStationsProgress);
router.get('/progress/term/:termId/section/:sectionId', evaluations.selector.getSectionStationsProgress);


export default router;
