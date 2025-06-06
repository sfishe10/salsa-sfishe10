const db = require('../../config/db');

/**
 * Section selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM Section ORDER BY name',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      }
      res.jsonp(results);
    },
  );
};
