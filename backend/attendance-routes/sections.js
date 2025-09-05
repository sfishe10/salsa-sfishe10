const express = require('express');
const sections = require('../attendance-controllers/sections');

const router = express.Router();

/**
 * admin operations
 */
//
// router.post('/', terms.admin.create);
// router.put('/:id', terms.admin.update);
// router.delete('/:id', terms.admin.delete);

/**
 * selectors
 */

router.get('/', sections.selector.getAll);
router.get('/:id', sections.selector.getById);

module.exports = router;
