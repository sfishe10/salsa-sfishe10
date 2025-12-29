import { Router } from 'express';
import multer from 'multer';
import * as users from '../controllers/users';

const upload = multer({ storage: multer.memoryStorage() });

const router: Router = Router();

/**
 * admin
 */

router.post('/', users.admin.create);
router.put('/', users.admin.update);
router.post('/uploadRolesCsv', upload.single('file'), users.admin.uploadRolesCsv);

/**
 * selectors
 */

router.get('/', users.selector.getAll);
router.get('/:id', users.selector.getById);
router.get('/role/:role', users.selector.getByRole);

export default router;
