import { Router } from 'express';
import pepBands from '../controllers/pep-bands';

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

router.get('/', pepBands.selector.getAll);

export default router;
