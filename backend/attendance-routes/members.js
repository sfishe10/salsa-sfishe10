const express = require('express');
const multer = require('multer');
const members = require('../attendance-controllers/members');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/**
 * admin
 */

router.post('/', members.admin.create);
router.put('/:id', members.admin.update);
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

module.exports = router;
