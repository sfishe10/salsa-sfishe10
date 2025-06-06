const express = require('express');
const members = require('../attendance-controllers/members');

const router = express.Router();

/**
 * admin
 */

router.post('/', members.admin.create);

/**
 * selectors
 */

router.get('/', members.selector.getAll);
router.get('/:id', members.selector.getById);
router.get('/section/:id', members.selector.getSection);
router.get('/term/:id', members.selector.getByTermId);

module.exports = router;
