const db = require('../../config/db');
const { convertDateToPST } = require('../../utilities/utilities');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT eventId, type, title, date, pepBandId, termId FROM MBEvent ORDER BY date',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const convertedResults = [...results].map((event) => ({
          ...event,
          date: convertDateToPST(event.date),
        }));
        res.jsonp(convertedResults);
      }
    },
  );
};

module.exports.getRecent = async (req, res) => {
  db.execute(
    'SELECT * ' +
    'FROM MBEvent JOIN Term on MBEvent.termId = Term.termId ' +
    'WHERE date < DATE_ADD(NOW(), interval 1 hour) AND Term.startDate <= NOW() AND Term.endDate >= NOW() ' +
    'ORDER BY date',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const convertedResults = [...results].map((event) => ({
          ...event,
          date: convertDateToPST(event.date),
        }));
        res.jsonp(convertedResults);
      }
    },
  );
};

module.exports.getUpcoming = async (req, res) => {
  db.execute(
    'SELECT * ' +
    'FROM MBEvent JOIN Term on MBEvent.termId = Term.termId ' +
    'WHERE date >= DATE_ADD(NOW(), interval 1 hour) AND Term.startDate <= NOW() AND Term.endDate >= NOW() ' +
    'ORDER BY date',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const convertedResults = [...results].map((event) => ({
          ...event,
          date: convertDateToPST(event.date),
        }));
        res.jsonp(convertedResults);
      }
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute('SELECT e.eventId, e.title, e.type, e.date, e.pepBandId AS eventPepBandId, e.termId, ' +
      'ea.attendanceId, ea.memberId, ea.attendance, ea.subId, m.pepBandId as memberPepBandId, ' +
      'm.sectionId, m.rehearsalConflict, u.userId, u.firstName, u.lastName, u.email, u.role, p.displayName, s.name as sectionName ' +
      'FROM MBEvent e LEFT JOIN EventAttendance ea ON e.eventId = ea.eventId ' +
      'LEFT JOIN Member m ON ea.memberId = m.memberId ' +
      'LEFT JOIN User u on m.userId = u.userId ' +
      'LEFT JOIN PepBand p on m.pepBandId = p.bandId ' +
      'LEFT JOIN Section s on m.sectionId = s.sectionId ' +
      'WHERE e.eventId=?',
  [req.params.id],
  (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      if (!results.length) res.status(404).json({ message: 'Event not found' });
      const event = {
        eventId: results[0].eventId,
        title: results[0].title,
        type: results[0].type,
        date: convertDateToPST(results[0].date),
        pepBandId: results[0].eventPepBandId,
        termId: results[0].termId,
        attendees: results
          .filter((row) => row.attendanceId !== null) // in case there are no attendances
          .map((row) => ({
            memberId: row.memberId,
            user: {
              userId: row.userId,
              firstName: row.firstName,
              lastName: row.lastName,
              email: row.email,
              role: row.role,
            },
            pepBand: {
              bandId: row.memberPepBandId,
              displayName: row.displayName,
            },
            section: {
              sectionId: row.sectionId,
              name: row.sectionName,
            },
            rehearsalConflict: row.rehearsalConflict,
          })),
        attendances: results
          .filter((row) => row.attendanceId !== null) // in case there are no attendances
          .map((row) => ({
            attendanceId: row.attendanceId,
            memberId: row.memberId,
            attendance: row.attendance,
            subId: row.subId,
          })),
      };
      res.send(event);
    }
  });
};

module.exports.getByTermId = async (req, res) => {
  db.execute(
    'SELECT * '
    + 'FROM MBEvent '
    + 'WHERE termId=? '
    + 'ORDER BY date',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const convertedResults = [...results].map((event) => ({
          ...event,
          date: convertDateToPST(event.date),
        }));
        res.jsonp(convertedResults);
      }
    },
  );
};
