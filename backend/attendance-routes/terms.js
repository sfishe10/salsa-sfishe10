const express = require('express');
const terms = require('../attendance-controllers/terms');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', terms.admin.create);
router.put('/:id', terms.admin.update);
router.delete('/:id', terms.admin.delete);

/**
 * selectors
 */

router.get('/', terms.selector.getAll);
// router.get('/:id', terms.selector.getById);

module.exports = router;
