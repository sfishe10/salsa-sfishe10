import { Router } from 'express';
import * as terms from '../controllers/terms';

const router: Router = Router();

/**
 * admin operations
 */

router.post('/', terms.admin.create);
router.put('/:id', terms.admin.update);
router.delete('/:id', terms.admin.deleteTerm);

/**
 * selectors
 */

router.get('/', terms.selector.getAll);
router.get('/:id', terms.selector.getById);

export default router;
