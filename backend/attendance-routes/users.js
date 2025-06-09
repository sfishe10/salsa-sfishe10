const express = require('express');
const users = require('../attendance-controllers/users');

const router = express.Router();

/**
 * admin
 */

router.post('/', users.admin.create);

/**
 * selectors
 */

router.get('/', users.selector.getAll);
router.get('/:id', users.selector.getById);

module.exports = router;
