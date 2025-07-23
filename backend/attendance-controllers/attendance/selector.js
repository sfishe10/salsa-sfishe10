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
    'JOIN Member sub ON ea.subId = sub.memberId ' +
    'JOIN User sub_u ON sub.email = sub_u.email ' +
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
          eventDate: row.date,
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
    'u.firstName, u.lastName, u.email, u.role, ' +
    'sub.pepBandId as subPepBandId, p3.displayName as subPepBandName, sub.rehearsalConflict as subConflict, ' +
    'sub_u.firstName as subFirst, sub_u.lastName as subLast, sub_u.email as subEmail, sub_u.role as subRole, ' +
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
    'WHERE e.eventId=? AND m.sectionId=?', [req.params.eventId, req.params.sectionId],
  (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      if (!results.length) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const attendances = [];
      results.forEach((row) => {
        const attendance = {
          attendanceId: row.attendanceId,
          event: {
            eventId: row.eventId,
            type: row.type,
            title: row.title,
            date: row.date,
            pepBand:
              row.eventPepBandId
                ? {
                  bandId: row.eventPepBandId,
                  displayName: row.eventPepBandName,
                } : null,
          },
          member: {
            memberId: row.memberId,
            user: {
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
          },
          sub: {
            memberId: row.subId,
            user: {
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
          },
          attendance: row.attendance,
        };
        attendances.push(attendance);
      });
      res.send(attendances);
    }
  });
};
