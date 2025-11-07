import { Router } from 'express';
import multer from 'multer';
import members from '../controllers/members';

const upload = multer({ storage: multer.memoryStorage() });

const router: Router = Router();

/**
 * admin
 */

router.post('/', members.admin.create);
router.put('/:id', members.admin.update);
router.delete('/:id', members.admin.delete);
router.post('/term/:id/uploadCsv', upload.single('file'), members.admin.uploadCsv);
router.post('/term/:id/uploadPepBandsCsv', upload.single('file'), members.admin.uploadPepBandsCsv);
router.post('/term/:id/uploadRehearsalConflictsCsv', upload.single('file'), members.admin.uploadRehearsalConflictsCsv);

/**
 * selectors
 */

router.get('/', members.selector.getAll);
router.get('/:id', members.selector.getById);
router.get('/section/:id', members.selector.getSection);
router.get('/term/:id', members.selector.getByTermId);

export default router;
