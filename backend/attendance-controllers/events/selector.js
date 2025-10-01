const db = require('../../config/db');
const { convertDateToPST } = require('../../utilities/utilities');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT e.*, t.*, p.*, ' +
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
            extraAttendeesAllowed: row.extraAttendeesAllowed,
          });
        });
        res.send(events);
      }
    },
  );
};

module.exports.getRecent = async (req, res) => {
  db.execute(
    'SELECT e.*, t.*, p.displayName ' +
    'FROM MBEvent e ' +
    'JOIN Term t on e.termId = t.termId ' +
    'LEFT JOIN PepBand p on e.pepBandId = p.bandId ' +
    'WHERE date < DATE_SUB(NOW(), interval 1 hour) AND t.startDate <= NOW() AND t.endDate >= NOW() ' +
    'ORDER BY date desc',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const events = [];
        results.forEach((row) => {
          const newEvent = {
            eventId: row.eventId,
            title: row.title,
            date: convertDateToPST(row.date),
            type: row.type,
            term: {
              termId: row.termId,
              termName: row.termName,
              startDate: row.startDate,
              endDate: row.endDate,
            },
            pepBand: {
              bandId: row.pepBandId,
              displayName: row.displayName,
            },
            extraAttendeesAllowed: row.extraAttendeesAllowed,
          };
          events.push(newEvent);
        });
        res.send(events);
      }
    },
  );
};

module.exports.getUpcoming = async (req, res) => {
  db.execute(
    'SELECT e.*, t.*, p.displayName ' +
    'FROM MBEvent e ' +
    'JOIN Term t on e.termId = t.termId ' +
    'LEFT JOIN PepBand p on e.pepBandId = p.bandId ' +
    'WHERE date >= DATE_SUB(NOW(), interval 1 hour) AND t.startDate <= NOW() AND t.endDate >= NOW() ' +
    'ORDER BY date',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const events = [];
        results.forEach((row) => {
          const newEvent = {
            eventId: row.eventId,
            title: row.title,
            date: convertDateToPST(row.date),
            type: row.type,
            term: {
              termId: row.termId,
              termName: row.termName,
              startDate: row.startDate,
              endDate: row.endDate,
            },
            pepBand: {
              bandId: row.pepBandId,
              displayName: row.displayName,
            },
            extraAttendeesAllowed: row.extraAttendeesAllowed,
          };
          events.push(newEvent);
        });
        res.send(events);
      }
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute('SELECT e.eventId, e.title, e.type, e.date, e.pepBandId AS eventPepBandId, p.displayName as eventPepBandName, t.* ' +
    'FROM MBEvent e ' +
      'LEFT JOIN PepBand p on e.pepBandId = p.bandId ' +
      'LEFT JOIN Term t on e.termId = t.termId ' +
      'WHERE e.eventId=?',
  [req.params.id],
  (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
    } else {
      if (!results.length) {
        return res.status(404).json({ message: 'Event not found' });
      }
      console.log(results);
      const event = {
        eventId: results[0].eventId,
        title: results[0].title,
        type: results[0].type,
        date: convertDateToPST(results[0].date),
        pepBand: results[0].eventPepBandId ? {
          bandId: results[0].eventPepBandId,
          displayName: results[0].eventPepBandName,
        } : null,
        term: {
          termId: results[0].termId,
          termName: results[0].termName,
          startDate: results[0].startDate,
          endDate: results[0].endDate,
        },
        extraAttendeesAllowed: results[0].extraAttendeesAllowed,
      };
      res.send(event);
    }
  });
};

module.exports.getByTermId = async (req, res) => {
  db.execute(
    'SELECT e.*, t.*, p.* ' +
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
            extraAttendeesAllowed: row.extraAttendeesAllowed,
          });
        });
        console.log(events);
        res.send(events);
      }
    },
  );
};

module.exports.getRosterMemberCounts = async (req, res) => {
  db.execute(
    'SELECT v.*, e.*, t.*, p.displayName, s.* ' +
    'FROM VolunteerRosterMemberCount v ' +
    'JOIN MBEvent e on v.eventId = e.eventId ' +
    'JOIN Term t on e.termId = t.termId ' +
    'JOIN Section s on v.sectionId = s.sectionId ' +
    'LEFT JOIN PepBand p on e.pepBandId = p.bandId ' +
    'WHERE e.eventId=?', [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const event = {
          eventId: results[0].eventId,
          title: results[0].title,
          date: convertDateToPST(results[0].date),
          type: results[0].type,
          term: {
            termId: results[0].termId,
            termName: results[0].termName,
            startDate: results[0].startDate,
            endDate: results[0].endDate,
          },
          pepBand: {
            bandId: results[0].pepBandId,
            displayName: results[0].displayName,
          },
          extraAttendeesAllowed: results[0].extraAttendeesAllowed,
        };
        const counts = [];
        results.forEach((row) => {
          const memberCount = {
            event,
            section: {
              sectionId: row.sectionId,
              name: row.name,
            },
            numMembersNeeded: row.numMembersNeeded,
          };
          counts.push(memberCount);
        });
        res.send(counts);
      }
    },
  );
};
