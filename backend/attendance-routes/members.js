const express = require('express');
const members = require('../attendance-controllers/members');

const router = express.Router();

/**
 * selectors
 */

router.get('/', members.selector.getAll);
router.get('/:id', members.selector.getById);
router.get('/section/:id', members.selector.getSection);

module.exports = router;
