const db = require('../../config/db');

module.exports.create = async (req, res) => {
  const formattedStartDate = new Date(req.body.term.startDate).toISOString().slice(0, 19).replace('T', ' ');
  const formattedEndDate = new Date(req.body.term.endDate).toISOString().slice(0, 19).replace('T', ' ');
  db.execute('INSERT INTO Term (termName, startDate, endDate) VALUES (?, ?, ?)',
    [req.body.term.termName, formattedStartDate, formattedEndDate],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.send(result);
      }
    });
};

module.exports.update = async (req, res) => {
  const formattedStartDate = new Date(req.body.term.startDate).toISOString().slice(0, 19).replace('T', ' ');
  const formattedEndDate = new Date(req.body.term.endDate).toISOString().slice(0, 19).replace('T', ' ');
  db.execute('UPDATE Term SET termName=?, termStartDate=?, termEndDate=? WHERE termId=?',
    [req.body.term.termName, formattedStartDate, formattedEndDate, req.body.term.termId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.send(result);
      }
    });
};

module.exports.delete = async (req, res) => {
  await db.execute('DELETE FROM Term WHERE termId=?', [req.params.id]);
  res.end();
};
