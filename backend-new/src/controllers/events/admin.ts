const db = require('../../../config/db');

module.exports.create = async (req, res) => {
  const formattedDate = new Date(req.body.event.date).toISOString().slice(0, 19).replace('T', ' ');
  const pepBandId = req.body.event.pepBand ? req.body.event.pepBand.bandId : null;
  db.execute('CALL CreateEventAndAttendance(?, ?, ?, ?, ?)',
    [req.body.event.type, req.body.event.title, formattedDate,
      pepBandId, req.body.event.term.termId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        // Stored procs with SELECT return as nested arrays
        const eventId = result[0][0].eventId;
        res.send({ eventId });
      }
    });
};

module.exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const event = req.body.event;
  const formattedDate = new Date(event.date).toISOString().slice(0, 19).replace('T', ' ');
  let params = [event.type, event.title, formattedDate, event.extraAttendeesAllowed, eventId];
  let pepBandClause = '';
  if (event.type === 'Pep Event') {
    pepBandClause = 'pepBandId=? ';
    params = [event.type, event.title, formattedDate, event.extraAttendeesAllowed, event.pepBand.bandId, eventId];
  }
  const SQL = `UPDATE MBEvent SET type=?, title=?, date=?, extraAttendeesAllowed=?, ${pepBandClause} WHERE eventId=?`;
  // TODO: if the pep band is changed, EventAttendances will also need to be deleted and reassigned
  db.execute(SQL, params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      params = [];
      let countClause = 'CASE sectionId ';
      req.body.volunteerRosterMemberCounts.forEach((count) => {
        countClause += 'WHEN ? THEN ? ';
        params.push(count.section.sectionId);
        params.push(count.numMembersNeeded);
      });
      countClause += 'END ';
      params.push(req.body.event.eventId);
      const rosterCountSql = `UPDATE VolunteerRosterMemberCount SET numMembersNeeded=${countClause} WHERE eventId=?`;
      db.execute(rosterCountSql, params, (err2, result2) => {
        if (err2) {
          console.log(err2);
          res.status(500).send(err2.message);
        } else {
          res.send(result2);
        }
      });
    }
  });
};

module.exports.delete = async (req, res) => {
  db.execute('DELETE FROM EventAttendance WHERE eventId=?', [req.params.id], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      db.execute('DELETE FROM MBEvent WHERE eventId=?', [req.params.id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send(err.message);
        } else {
          res.send(result);
        }
      });
    }
  });
};
