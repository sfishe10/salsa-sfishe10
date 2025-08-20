const db = require('../../config/db');

module.exports.create = async (req, res) => {
  const params = [req.body.eventId, req.body.memberId];
  await db.execute('INSERT INTO EventAttendance (eventId, memberId, attendance, subId, required) VALUES (?, ?, NULL, NULL, FALSE)',
    params,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        // send back the auto-generated ID
        res.send({ attendanceId: result.insertId });
      }
    });
};

module.exports.update = async (req, res) => {
  const attendanceId = req.params.id;
  await db.execute('UPDATE EventAttendance SET memberId=?, attendance=? WHERE attendanceId=?',
    [req.body.memberId, req.body.attendance, attendanceId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.send(results);
      }
    });
};

module.exports.submitForm = async (req, res) => {
  let memberIdClause = 'CASE attendanceId ';
  let attendanceClause = 'CASE attendanceId ';
  let subIdClause = 'CASE attendanceId ';
  let attendanceIds = '';
  const memberIdParams = [];
  const attendanceParams = [];
  const subIdParams = [];
  console.log(req.body.attendances);
  req.body.attendances.forEach((attendance) => {
    const attendanceId = attendance.attendanceId;
    memberIdClause += 'WHEN ? THEN ? ';
    memberIdParams.push(attendanceId);
    memberIdParams.push(attendance.member.memberId);
    attendanceClause += 'WHEN ? THEN ? ';
    attendanceParams.push(attendanceId);
    attendanceParams.push(attendance.attendance);
    subIdClause += 'WHEN ? THEN ? ';
    subIdParams.push(attendanceId);
    subIdParams.push(attendance.sub ? attendance.sub.memberId : null);
    attendanceIds += `${attendanceId}, `;
  });
  memberIdClause += 'END ';
  attendanceClause += 'END ';
  subIdClause += 'END ';
  // remove last comma and space
  attendanceIds = attendanceIds.slice(0, -2);
  await db.execute(`UPDATE EventAttendance SET memberId=${memberIdClause}, 
                           attendance=${attendanceClause}, subId=${subIdClause} WHERE attendanceId IN (${attendanceIds})`,
  memberIdParams.concat(attendanceParams).concat(subIdParams),
  (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      res.send(results);
    }
  });
};

// module.exports.createEntries = async (req, res) => {
//   const params = [];
//   let insertString = 'INSERT INTO EventAttendance (eventId, memberId, attendance, subId) VALUES ';
//   req.body.attendances.forEach((attendance) => {
//     insertString += '(?, ?, ?, ?), ';
//     params.push(attendance.eventId);
//     params.push(attendance.memberId);
//     params.push(attendance.attendance);
//     params.push(attendance.subId);
//   });
//   // remove last comma and space
//   insertString = insertString.slice(0, -2);
//   await db.execute(insertString, params, (err, results) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err.message);
//     } else {
//       res.send(results);
//     }
//   });
// };

module.exports.delete = async (req, res) => {
  const attendanceId = req.params.id;
  await db.execute('DELETE FROM EventAttendance WHERE attendanceId=?',
    [attendanceId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        res.send(results);
      }
    });
};
