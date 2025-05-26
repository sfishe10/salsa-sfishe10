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
  // db.execute('INSERT INTO MBEvent (type, title, date, pepBandId, termId) VALUES (?, ?, ?, ?, ?)',
  //   [req.body.event.type, req.body.event.title, formattedDate,
  //     req.body.event.pepBandId, req.body.event.termId],
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).send(err.message);
  //     }
  //     const newEventId = result.insertId;
  //     const params = [];
  //     let whereClause = '';
  //     if (req.body.event.type === Constants.EVENT_TYPE_EVENT) {
  //       whereClause = 'WHERE pepBandId=?';
  //       params.push(req.body.event.pepBandId);
  //     }
  //     db.execute(`SELECT memberId FROM Member ${whereClause}`,
  //       params,
  //       (err2, attendees) => {
  //         if (err2) {
  //           console.log(err2);
  //           res.status(500).send(err2.message);
  //         }
  //         let insertVals = '';
  //         const params2 = [];
  //         attendees.forEach((member) => {
  //           insertVals += '(?, ?, NULL), ';
  //           params2.push(newEventId);
  //           params2.push(member.memberId);
  //         });
  //         // remove last comma and space
  //         insertVals = insertVals.slice(0, -2);
  //         db.execute(`INSERT INTO EventAttendance (eventId, memberId, attendance) VALUES ${insertVals}`,
  //           params2,
  //           (err3, result2) => {
  //             if (err3) {
  //               console.log(err3);
  //               res.status(500).send(err3.message);
  //             }
  //             res.send(result2);
  //           });
  //       });
  //   });
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
  await db.execute('DELETE FROM Events WHERE eventID=?', [req.params.id]);
  res.end();
};
