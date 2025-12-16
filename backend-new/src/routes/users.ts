import { Router } from 'express';
import multer from 'multer';
import * as users from '../controllers/users';

const upload = multer({ storage: multer.memoryStorage() });

const router: Router = Router();

export default router;

/**
 * admin
 */

router.post('/', users.admin.create);
router.put('/', users.admin.update);
router.put('/assignRole', users.admin.assignRole);
router.post('/uploadRolesCsv', upload.single('file'), users.admin.uploadRolesCsv);

/**
 * selectors
 */

router.get('/', users.selector.getAll);
router.get('/:id', users.selector.getById);
router.get('/role/:role', users.selector.getByRole);

module.exports = router;
