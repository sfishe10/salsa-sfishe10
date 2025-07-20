const db = require('../../config/db');

module.exports.create = async (req, res) => {
  console.log(req.body.event);
  const formattedDate = new Date(req.body.event.date).toISOString().slice(0, 19).replace('T', ' ');
  db.execute('INSERT INTO MBEvent (type, title, date, pepBandId, termId) VALUES (?, ?, ?, ?, ?)',
    [req.body.event.type, req.body.event.title, formattedDate,
      req.body.event.pepBand.bandId, req.body.event.term.termId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.send(result);
      }
    });
};

module.exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const event = req.body.event;
  const formattedDate = new Date(event.date).toISOString().slice(0, 19).replace('T', ' ');
  let params = [event.type, event.title, formattedDate, event.term.termId, eventId];
  let pepBandClause = '';
  if (event.type === 'Pep Event') {
    pepBandClause = 'pepBandId=?, ';
    params = [event.type, event.title, formattedDate, event.pepBand.bandId, event.term.termId, eventId];
  }
  const SQL = `UPDATE MBEvent SET type=?, title=?, date=?, ${pepBandClause} termId=? WHERE eventId=?`;
  db.execute(SQL, params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      res.send(result);
    }
  });
};

module.exports.delete = async (req, res) => {
  db.execute('DELETE FROM MBEvent WHERE eventId=?', [req.params.id]);
  res.end();
};
