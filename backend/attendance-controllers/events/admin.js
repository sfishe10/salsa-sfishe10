const db = require('../../config/db');

module.exports.create = async (req, res) => {
  const formattedDate = new Date(req.body.event.date).toISOString().slice(0, 19).replace('T', ' ');
  db.execute('CALL CreateEventAndAttendance(?, ?, ?, ?, ?)',
    [req.body.event.type, req.body.event.title, formattedDate,
      req.body.event.pepBandId, req.body.event.termId],
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
  const eventID = req.params.id;
  let updates = '';

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === 'DEFAULT') {
      updates += `${key}=DEFAULT, `;
    } else if (!req.body[key]) {
      updates += `${key}=NULL, `;
    } else {
      updates += `${key}='${req.body[key]}', `;
    }
  });
  updates = updates.slice(0, -2);

  const SQL = `UPDATE Events SET ${updates} WHERE eventID=${eventID}`;
  db.execute(SQL);

  res.end();
};

module.exports.delete = async (req, res) => {
  db.execute('DELETE FROM MBEvent WHERE eventId=?', [req.params.id]);
  res.end();
};
