const db = require('../../config/db');
const { convertDateToPST } = require('../../utilities/utilities');

/**
 * Attendance selectors
 */

module.exports.getById = async (req, res) => {
  const attendanceId = req.params.id;
  db.execute('SELECT e.eventId, e.title, e.type, e.date, e.pepBandId AS eventPepBandId, p1.displayName as eventPepBandName, ' +
    'ea.*, ' +
    'm.pepBandId as memberPepBandId, p2.displayName as memberPepBandName, m.sectionId, m.rehearsalConflict, ' +
    'u.userId, u.firstName, u.lastName, u.email, u.role, ' +
    'sub.pepBandId as subPepBandId, p3.displayName as subPepBandName, sub.rehearsalConflict as subConflict, ' +
    'sub_u.userId as subUserId, sub_u.firstName as subFirst, sub_u.lastName as subLast, sub_u.email as subEmail, sub_u.role as subRole, ' +
    's.name as sectionName, ' +
    't.* ' +
    'FROM EventAttendance ea ' +
    'JOIN MBEvent e ON e.eventId = ea.eventId ' +
    'LEFT JOIN Member m ON ea.memberId = m.memberId ' +
    'LEFT JOIN Member sub ON ea.subId = sub.memberId ' +
    'LEFT JOIN User sub_u ON sub.email = sub_u.email ' +
    'LEFT JOIN User u on m.email = u.email ' +
    'LEFT JOIN PepBand p1 on e.pepBandId = p1.bandId ' +
    'LEFT JOIN PepBand p2 on m.pepBandId = p2.bandId ' +
    'LEFT JOIN PepBand p3 on sub.pepBandId = p3.bandId ' +
    'LEFT JOIN Section s on m.sectionId = s.sectionId ' +
    'LEFT JOIN Term t on e.termId = t.termId ' +
    'WHERE ea.attendanceId=? ' +
    'ORDER BY e.date', [attendanceId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      if (!result.length) {
        return res.status(404).send('Attendance not found');
      }
      const attendance = {
        attendanceId: result[0].attendanceId,
        event: {
          eventId: result[0].eventId,
          type: result[0].type,
          title: result[0].title,
          date: convertDateToPST(result[0].date),
          pepBand:
            result[0].eventPepBandId
              ? {
                bandId: result[0].eventPepBandId,
                displayName: result[0].eventPepBandName,
              } : null,
        },
        member: result[0].memberId
          ? {
            memberId: result[0].memberId,
            user: {
              userId: result[0].userId,
              email: result[0].email,
              firstName: result[0].firstName,
              lastName: result[0].lastName,
              role: result[0].role,
            },
            section: {
              sectionId: result[0].sectionId,
              displayName: result[0].memberPepBandName,
            },
            rehearsalConflict: result[0].rehearsalConflict,
            pepBand:
              result[0].memberPepBandId
                ? {
                  bandId: result[0].memberPepBandId,
                  displayName: result[0].memberPepBandName,
                } : null,
            term: {
              termId: result[0].termId,
              termName: result[0].termName,
              startDate: result[0].startDate,
              endDate: result[0].endDate,
            },
          } : null,
        sub: result[0].subId ? {
          memberId: result[0].subId,
          user: {
            userId: result[0].subUserId,
            email: result[0].subEmail,
            firstName: result[0].subFirst,
            lastName: result[0].subLast,
            role: result[0].subRole,
          },
          section: {
            sectionId: result[0].sectionId,
            displayName: result[0].memberPepBandName,
          },
          rehearsalConflict: result[0].subConflict,
          pepBand:
            result[0].subPepBandId
              ? {
                bandId: result[0].subPepBandId,
                displayName: result[0].subPepBandName,
              } : null,
          term: {
            termId: result[0].termId,
            termName: result[0].termName,
            startDate: result[0].startDate,
            endDate: result[0].endDate,
          },
        } : null,
        attendance: result[0].attendance,
        required: result[0].required,
        lastUpdated: result[0].lastUpdated,
      };
      res.send(attendance);
    }
  });
};

module.exports.getByMemberId = async (req, res) => {
  const memberId = req.params.id;
  db.execute('SELECT attendanceId, attendance, ' +
    'e.*, mem.memberId, u.firstName as memFirst, u.lastName as memLast, ' +
    'sub.memberId as subId, sub_u.firstName as subFirst, sub_u.lastName as subLast ' +
    'FROM ' +
    'EventAttendance ea ' +
    'JOIN MBEvent e ON ea.eventId = e.eventId ' +
    'JOIN Member mem ON ea.memberId = mem.memberId ' +
    'JOIN User u ON mem.email = u.email ' +
    'LEFT JOIN Member sub ON ea.subId = sub.memberId ' +
    'LEFT JOIN User sub_u ON sub.email = sub_u.email ' +
    'WHERE ea.memberId=? OR ea.subId=? ' +
    'ORDER BY e.date', [memberId, memberId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      const attendances = [];
      results.forEach((row) => {
        const attendance = {
          attendanceId: row.attendanceId,
          attendanceStatus: row.attendance,
          eventId: row.eventId,
          eventTitle: row.title,
          eventType: row.type,
          eventDate: convertDateToPST(row.date),
          memberId: row.memberId,
          memberFirstName: row.memFirst,
          memberLastName: row.memLast,
          subId: row.subId,
          subFirstName: row.subFirst,
          subLastName: row.subLast,
        };
        attendances.push(attendance);
      });
      res.send(attendances);
    }
  });
};

module.exports.getBySectionAndEventId = async (req, res) => {
  db.execute('SELECT e.eventId, e.title, e.type, e.date, e.pepBandId AS eventPepBandId, p1.displayName as eventPepBandName, ' +
    'ea.*, ' +
    'm.pepBandId as memberPepBandId, p2.displayName as memberPepBandName, m.sectionId, m.rehearsalConflict, ' +
    'u.userId, u.firstName, u.lastName, u.email, u.role, ' +
    'sub.pepBandId as subPepBandId, p3.displayName as subPepBandName, sub.rehearsalConflict as subConflict, ' +
    'sub_u.userId as subUserId, sub_u.firstName as subFirst, sub_u.lastName as subLast, sub_u.email as subEmail, sub_u.role as subRole, ' +
    's.name as sectionName, ' +
    't.* ' +
    'FROM EventAttendance ea ' +
    'JOIN MBEvent e ON e.eventId = ea.eventId ' +
    'LEFT JOIN Member m ON ea.memberId = m.memberId ' +
    'LEFT JOIN Member sub ON ea.subId = sub.memberId ' +
    'LEFT JOIN User sub_u ON sub.email = sub_u.email ' +
    'LEFT JOIN User u on m.email = u.email ' +
    'LEFT JOIN PepBand p1 on e.pepBandId = p1.bandId ' +
    'LEFT JOIN PepBand p2 on m.pepBandId = p2.bandId ' +
    'LEFT JOIN PepBand p3 on sub.pepBandId = p3.bandId ' +
    'LEFT JOIN Section s on m.sectionId = s.sectionId ' +
    'LEFT JOIN Term t on e.termId = t.termId ' +
    'WHERE e.eventId=? AND ea.sectionId=?', [req.params.eventId, req.params.sectionId],
  (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      const attendances = [];
      results.forEach((row) => {
        const attendance = {
          attendanceId: row.attendanceId,
          event: {
            eventId: row.eventId,
            type: row.type,
            title: row.title,
            date: convertDateToPST(row.date),
            pepBand:
              row.eventPepBandId
                ? {
                  bandId: row.eventPepBandId,
                  displayName: row.eventPepBandName,
                } : null,
          },
          member: row.memberId
            ? {
              memberId: row.memberId,
              user: {
                userId: row.userId,
                email: row.email,
                firstName: row.firstName,
                lastName: row.lastName,
                role: row.role,
              },
              section: {
                sectionId: row.sectionId,
                displayName: row.memberPepBandName,
              },
              rehearsalConflict: row.rehearsalConflict,
              pepBand:
                row.memberPepBandId
                  ? {
                    bandId: row.memberPepBandId,
                    displayName: row.memberPepBandName,
                  } : null,
              term: {
                termId: row.termId,
                termName: row.termName,
                startDate: row.startDate,
                endDate: row.endDate,
              },
            } : null,
          sub: row.subId ? {
            memberId: row.subId,
            user: {
              userId: row.subUserId,
              email: row.subEmail,
              firstName: row.subFirst,
              lastName: row.subLast,
              role: row.subRole,
            },
            section: {
              sectionId: row.sectionId,
              displayName: row.memberPepBandName,
            },
            rehearsalConflict: row.subConflict,
            pepBand:
              row.subPepBandId
                ? {
                  bandId: row.subPepBandId,
                  displayName: row.subPepBandName,
                } : null,
            term: {
              termId: row.termId,
              termName: row.termName,
              startDate: row.startDate,
              endDate: row.endDate,
            },
          } : null,
          attendance: row.attendance,
          required: row.required,
        };
        attendances.push(attendance);
      });
      res.send(attendances);
    }
  });
};

module.exports.getByTermIdAndSection = async (req, res) => {
  const termId = req.params.termId;
  const sectionId = req.params.sectionId;
  const eventType = req.params.eventType;
  let sectionClause = '';
  const params = [termId, eventType];
  if (sectionId !== 'null') {
    sectionClause = 'and s.sectionId=? ';
    params.push(sectionId);
  }
  console.log(sectionClause);
  console.log(params);
  db.execute('SELECT attendanceId, attendance, ' +
    'e.*, mem.memberId, mem.rehearsalConflict, u.firstName as memFirst, u.lastName as memLast, ' +
    'sub.memberId as subId, sub_u.firstName as subFirst, sub_u.lastName as subLast, s.sectionId, s.name as sectionName ' +
    'FROM ' +
    'EventAttendance ea ' +
    'JOIN MBEvent e ON ea.eventId = e.eventId ' +
    'JOIN Member mem ON ea.memberId = mem.memberId ' +
    'JOIN User u ON mem.email = u.email ' +
    'LEFT JOIN Member sub ON ea.subId = sub.memberId ' +
    'LEFT JOIN User sub_u ON sub.email = sub_u.email ' +
    'JOIN Section s ON mem.sectionId = s.sectionId ' +
    'WHERE e.termId=? and e.type=? ' + sectionClause +
    'ORDER BY sectionId, e.date, memLast',
  params, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      const attendances = [];
      results.forEach((row) => {
        const attendance = {
          attendanceId: row.attendanceId,
          attendanceStatus: row.attendance,
          eventId: row.eventId,
          eventTitle: row.title,
          eventDate: convertDateToPST(row.date),
          memberId: row.memberId,
          memberFirstName: row.memFirst,
          memberLastName: row.memLast,
          rehearsalConflict: row.rehearsalConflict,
          subId: row.subId,
          subFirstName: row.subFirst,
          subLastName: row.subLast,
          sectionId: row.sectionId,
          sectionName: row.sectionName,
        };
        attendances.push(attendance);
      });
      res.send(attendances);
    }
  });
};

module.exports.getByTermIdAndSectionAndPepBand = async (req, res) => {
  const termId = req.params.termId;
  const sectionId = req.params.sectionId;
  const pepBandId = req.params.pepBandId;
  const ignoreMemberPepBand = req.query.ignoreMemberPepBand === 'true';
  const params = [termId, pepBandId];
  let pepBandClause = '';
  let sectionClause = '';
  if (!ignoreMemberPepBand) {
    pepBandClause = 'and mem.pepBandId=? ';
    params.push(pepBandId);
  }
  if (sectionId !== 'null') {
    sectionClause = 'and s.sectionId=? ';
    params.push(sectionId);
  }
  db.execute('SELECT attendanceId, attendance, ' +
    'e.*, mem.memberId, mem.rehearsalConflict, u.firstName as memFirst, u.lastName as memLast, ' +
    'sub.memberId as subId, sub_u.firstName as subFirst, sub_u.lastName as subLast, s.sectionId, s.name as sectionName ' +
    'FROM ' +
    'EventAttendance ea ' +
    'JOIN MBEvent e ON ea.eventId = e.eventId ' +
    'JOIN Member mem ON ea.memberId = mem.memberId ' +
    'JOIN User u ON mem.email = u.email ' +
    'LEFT JOIN Member sub ON ea.subId = sub.memberId ' +
    'LEFT JOIN User sub_u ON sub.email = sub_u.email ' +
    'JOIN Section s ON mem.sectionId = s.sectionId ' +
    'WHERE e.termId=? and e.pepBandId=? ' + pepBandClause + sectionClause +
    'ORDER BY sectionId, e.date, memLast', params, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const attendances = [];
        results.forEach((row) => {
          const attendance = {
            attendanceId: row.attendanceId,
            attendanceStatus: row.attendance,
            eventId: row.eventId,
            eventTitle: row.title,
            eventDate: convertDateToPST(row.date),
            memberId: row.memberId,
            memberFirstName: row.memFirst,
            memberLastName: row.memLast,
            rehearsalConflict: row.rehearsalConflict,
            subId: row.subId,
            subFirstName: row.subFirst,
            subLastName: row.subLast,
            sectionId: row.sectionId,
            sectionName: row.sectionName,
          };
          attendances.push(attendance);
        });
        res.send(attendances);
      }
    });
};

module.exports.getMemberStatsBySectionId = async (req, res) => {
  const sectionId = req.params.id;
  db.execute('select m.memberId, m.termId, m.email, u.firstName, u.lastName, ' +
    'count(case when ' +
      '(m.memberId = ea.memberId ' +
      'and e.type = \'Rehearsal\' ' +
      'and ea.attendance not like \'%Absent%\') then 1 end) as numRehearsals, ' +
    'count(case when ' +
      '(m.memberId = ea.memberId ' +
      'and e.type = \'Whole Band Event\' ' +
      'and ea.attendance not like \'%Absent%\') then 1 end) as numWholeBandEvents, ' +
    'count(case when ' +
      '(m.memberId = ea.memberId ' +
      'and e.type = \'Pep Event\' ' +
      'and ea.attendance not like \'%Absent%\'' +
      'and ea.attendance not like \'%Sub%\') then 1 end) as numPepEvents, ' +
    'count(case when (m.memberId = ea.memberId ' +
      'and e.type = \'Volunteer\' ' +
      'and ea.attendance not like \'%Absent%\') then 1 end) as numVolunteerEvents, ' +
    'count(case when ea.subId = m.memberId then 1 end) as numSubEvents ' +
  'from Member m ' +
    'left join User u on m.email = u.email ' +
    'left join EventAttendance ea on (m.memberId = ea.memberId or m.memberId = ea.subId) ' +
    'left join MBEvent e on ea.eventId = e.eventId ' +
    'left join Term t on m.termId = t.termId ' +
  'where t.startDate <= NOW() and t.endDate >= NOW() ' +
    'and m.sectionId = ? ' +
  'group by m.memberId ' +
  'order by u.lastName', [sectionId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      const attendances = [];
      results.forEach((row) => {
        const attendance = {
          memberId: row.memberId,
          termId: row.termId,
          email: row.email,
          firstName: row.firstName,
          lastName: row.lastName,
          numRehearsals: row.numRehearsals,
          numWholeBandEvents: row.numWholeBandEvents,
          numPepEvents: row.numPepEvents,
          numVolunteerEvents: row.numVolunteerEvents,
          numSubEvents: row.numSubEvents,
        };
        attendances.push(attendance);
      });
      res.send(attendances);
    }
  });
};
