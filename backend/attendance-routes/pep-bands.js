const express = require('express');
const pepBands = require('../attendance-controllers/pep-bands');

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

router.get('/', pepBands.selector.getAll);

module.exports = router;
