const express = require('express');
const users = require('../attendance-controllers/users');

const router = express.Router();

/**
 * admin
 */

router.post('/', users.admin.create);
router.put('/', users.admin.update);

/**
 * selectors
 */

router.get('/', users.selector.getAll);
router.get('/:id', users.selector.getById);
router.get('/role/:role', users.selector.getByRole);

module.exports = router;
