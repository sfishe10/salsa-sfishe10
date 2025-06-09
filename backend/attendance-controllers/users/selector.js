const db = require('../../config/db');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM User ORDER BY lastName',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.jsonp(results);
      }
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute(
    'SELECT * FROM User where userId=? ORDER BY lastName',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.jsonp(results);
      }
    },
  );
};
