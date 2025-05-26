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


//
// module.exports.getById = async (req, res) => {
//   db.execute('SELECT e.eventId, e.title, e.type, e.date, e.pepBandId AS eventPepBandId, e.termId, ' +
//       'ea.attendanceId, ea.memberId, ea.attendance, m.pepBandId as memberPepBandId, m.firstName, m.lastName, m.sectionId, m.rehearsalConflict ' +
//       'FROM MBEvent e LEFT JOIN EventAttendance ea ON e.eventId = ea.eventId ' +
//       'LEFT JOIN Member m ON ea.memberId = m.memberId ' +
//       'WHERE e.eventId=?',
//   [req.params.id],
//   (err, results) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err.message);
//     } else {
//       const event = {
//         eventId: results[0].eventId,
//         title: results[0].title,
//         type: results[0].type,
//         date: results[0].date,
//         pepBandId: results[0].eventPepBandId,
//         termId: results[0].termId,
//         attendees: results
//           .filter((row) => row.attendanceId !== null) // in case there are no attendances
//           .map((row) => ({
//             memberId: row.memberId,
//             pepBandId: row.memberPepBandId,
//             firstName: row.firstName,
//             lastName: row.lastName,
//             sectionId: row.sectionId,
//             rehearsalConflict: row.rehearsalConflict,
//           })),
//         attendances: results
//           .filter((row) => row.attendanceId !== null) // in case there are no attendances
//           .map((row) => ({
//             attendanceId: row.attendanceId,
//             memberId: row.memberId,
//             attendance: row.attendance,
//           })),
//       };
//       res.send(event);
//     }
//   });
// };
