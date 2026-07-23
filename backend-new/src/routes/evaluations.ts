import {Router} from "express";
import * as evaluations from '../controllers/evaluations';

const router: Router = Router();


/**
 * admin operations
 */

router.post('/', evaluations.admin.create);


export default router;
