const db = require('../../config/db');
const {convertDateToPST} = require("../../utilities/utilities");

/**
 * Attendance selectors
 */

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
    'WHERE e.eventId=? AND (m.sectionId=? OR ea.memberId IS NULL)', [req.params.eventId, req.params.sectionId],
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

module.exports.getByTermId = async (req, res) => {
  const termId = req.params.id;
  const eventType = req.params.eventType;
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
    'WHERE e.termId=? and e.type=? ' +
    'ORDER BY sectionName, e.date, memLast',
  [termId, eventType], (err, results) => {
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

module.exports.getByTermIdAndPepBand = async (req, res) => {
  const termId = req.params.termId;
  const pepBandId = req.params.pepBandId;
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
    'WHERE e.termId=? and e.pepBandId=? and mem.pepBandId=? ' +
    'ORDER BY sectionName, e.date, memLast',
    [termId, pepBandId, pepBandId], (err, results) => {
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
