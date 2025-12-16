import { Router } from 'express';
import * as sections from '../controllers/sections';

const router: Router = Router();

/**
 * admin operations
 */
//
// router.post('/', terms.admin.create);
// router.put('/:id', terms.admin.update);
// router.delete('/:id', terms.admin.delete);

/**
 * selectors
 */

router.get('/', sections.selector.getAll);
router.get('/:id', sections.selector.getById);

export default router;
