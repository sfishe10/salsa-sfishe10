const db = require('../../../config/db');

/**
 * Section selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM Section ORDER BY sectionId',
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
      res.send(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  const sectionId = req.params.id;
  db.execute(
    'SELECT * FROM Section WHERE sectionId=?', [sectionId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
      if (!result.length) {
        return res.status(404).send('Section not found');
      }
      return res.send(result[0]);
    },
  );
};
