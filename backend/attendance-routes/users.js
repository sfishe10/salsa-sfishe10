const express = require('express');
const multer = require('multer');
const users = require('../attendance-controllers/users');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

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
