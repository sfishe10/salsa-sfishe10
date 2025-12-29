import { Router } from 'express';
import * as sections from '../controllers/sections';

const router: Router = Router();

/**
 * admin operations
 */

router.post('/', sections.admin.create);
router.put('/:id', sections.admin.update);
router.delete('/:id', sections.admin.deleteSection);

/**
 * selectors
 */

router.get('/', sections.selector.getAll);
router.get('/:id', sections.selector.getById);

export default router;
