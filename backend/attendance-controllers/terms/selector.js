const db = require('../../config/db');

/**
 * Term selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM Term ORDER BY startDate',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute('SELECT * FROM Term WHERE termId=?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.send(results[0]);
      }
    });
};
