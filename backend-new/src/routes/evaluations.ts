import {Router} from "express";
import * as evaluations from '../controllers/evaluations';

const router: Router = Router();


/**
 * admin operations
 */

router.post('/', evaluations.admin.create);


/**
 * selectors
 */
router.get('/:id', evaluations.selector.getById);


export default router;
