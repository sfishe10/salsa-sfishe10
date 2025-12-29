import { Router } from 'express';
import * as pepBands from '../controllers/pep-bands';

const router: Router = Router();

/**
 * admin operations
 */

router.post('/', pepBands.admin.create);
router.put('/:id', pepBands.admin.update);
router.delete('/:id', pepBands.admin.deletePepBand);

/**
 * selectors
 */

router.get('/', pepBands.selector.getAll);

export default router;
