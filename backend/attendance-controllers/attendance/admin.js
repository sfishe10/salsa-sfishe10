const db = require('../../config/db');

module.exports.create = async (req, res) => {
  let insertVals = '';
  const params = [];
  req.body.attendances.forEach((attendance) => {
    insertVals += '(?, ?, ?), ';
    params.push(attendance.eventId);
    params.push(attendance.memberId);
    params.push(attendance.attendance);
  });
  // remove last comma and space
  insertVals = insertVals.slice(0, -2);
  await db.execute(`INSERT INTO EventAttendance (eventId, memberId, attendance) VALUES ${insertVals}`,
    params,
    (err, results) => {
      if (err) console.log(err);
      res.send(results);
    });
};

// module.exports.updateSub = async (req, res) => {
//   const eventID = req.params.id;
//   await db.execute('UPDATE Substitutions SET newUserID=? WHERE eventID=? AND oldUserID=?',
//     [req.body.newUserID, eventID, req.body.oldUserID],
//     (err, results) => {
//       if (err) console.log(err);
//       res.send(results);
//     });
// };
//
// module.exports.deleteSub = async (req, res) => {
//   const eventID = req.params.id;
//   const { oldUserID } = req.params;
//   await db.execute('DELETE FROM Substitutions WHERE eventID=? AND oldUserID=?',
//     [eventID, oldUserID],
//     (err, results) => {
//       if (err) console.log(err);
//       res.send(results);
//     });
// };
