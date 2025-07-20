const db = require('../../config/db');
const { convertDateToPST } = require('../../utilities/utilities');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT eventId, type, title, date, t.*, p.*, ' +
    'FROM MBEvent e ' +
    'LEFT JOIN PepBand p on e.pepBandId = p.bandId ' +
    'JOIN Term t on e.termId = t.termId ' +
    'ORDER BY date',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const events = [];
        results.forEach((row) => {
          events.push({
            eventId: row.eventId,
            type: row.type,
            title: row.title,
            date: convertDateToPST(row.date),
            term: {
              termId: row.termId,
              termName: row.termName,
              startDate: row.startDate,
              endDate: row.endDate,
            },
            pepBand: {
              bandId: row.bandId,
              displayName: row.displayName,
            },
          });
        });
        res.send(events);
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
  db.execute('SELECT e.eventId, e.title, e.type, e.date, e.pepBandId AS eventPepBandId, p1.displayName as eventPepBandName, ' +
      'ea.attendanceId, ea.memberId, ea.attendance, ea.subId, m.pepBandId as memberPepBandId, p2.displayName as memberPepBandName, ' +
      'm.sectionId, m.rehearsalConflict, u.firstName, u.lastName, u.email, u.role, ' +
      's.name as sectionName, t.* ' +
      'FROM MBEvent e ' +
      'LEFT JOIN EventAttendance ea ON e.eventId = ea.eventId ' +
      'LEFT JOIN Member m ON ea.memberId = m.memberId ' +
      'LEFT JOIN User u on m.email = u.email ' +
      'LEFT JOIN PepBand p1 on e.pepBandId = p1.bandId ' +
      'LEFT JOIN PepBand p2 on m.pepBandId = p2.bandId ' +
      'LEFT JOIN Section s on m.sectionId = s.sectionId ' +
      'LEFT JOIN Term t on e.termId = t.termId ' +
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
        pepBand: {
          bandId: results[0].eventPepBandId,
          displayName: results[0].eventPepBandName,
        },
        term: {
          termId: results[0].termId,
          termName: results[0].termName,
          startDate: results[0].startDate,
          endDate: results[0].endDate,
        },
        attendees: results
          .filter((row) => row.attendanceId !== null) // in case there are no attendances
          .map((row) => ({
            memberId: row.memberId,
            user: {
              firstName: row.firstName,
              lastName: row.lastName,
              email: row.email,
              role: row.role,
            },
            pepBand: {
              bandId: row.memberPepBandId,
              displayName: row.memberPepBandName,
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
    'SELECT eventId, type, title, date, t.*, p.* ' +
    'FROM MBEvent e ' +
    'LEFT JOIN PepBand p on e.pepBandId = p.bandId ' +
    'LEFT JOIN Term t on e.termId = t.termId ' +
    'WHERE t.termId=? ' +
    'ORDER BY date', [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const events = [];
        results.forEach((row) => {
          events.push({
            eventId: row.eventId,
            type: row.type,
            title: row.title,
            date: convertDateToPST(row.date),
            term: {
              termId: row.termId,
              termName: row.termName,
              startDate: row.startDate,
              endDate: row.endDate,
            },
            pepBand: {
              bandId: row.bandId,
              displayName: row.displayName,
            },
          });
        });
        res.send(events);
      }
    },
  );
};
