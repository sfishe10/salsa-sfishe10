import { Router } from 'express';
import * as stations from '../controllers/stations';

const router: Router = Router();

/**
 * admin operations
 */

// router.post('/', stations.admin.create);
router.put('/:id', stations.admin.update);
// router.delete('/:id', stations.admin.deleteTerm);

router.put('/packets/:id', stations.admin.updatePacket);
router.delete('/packets/:id', stations.admin.deletePacket)

/**
 * selectors
 */

router.get('/', stations.selector.getAll);
router.get('/:id', stations.selector.getById);
router.get('/packets/:id', stations.selector.getPacketById);

export default router;
