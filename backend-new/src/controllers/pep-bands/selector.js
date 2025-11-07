const db = require('../../../config/db');

/**
 * Pep Band selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM PepBand ORDER BY bandId',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      }
      res.jsonp(results);
    },
  );
};
