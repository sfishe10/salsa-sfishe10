const db = require('../../config/db');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM Member ORDER BY sectionId',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute(
    'SELECT * FROM Member WHERE memberId=?',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results[0]);
    },
  );
};

module.exports.getSection = async (req, res) => {
  db.execute(
    'SELECT * FROM Member WHERE sectionId=?',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};
