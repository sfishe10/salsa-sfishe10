const db = require('../../config/db');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM Member ORDER BY sectionId',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute(
    'SELECT m.*, u.firstName, u.lastName, u.email, u.role, s.name, p.displayName ' +
    'FROM Member as m ' +
    'JOIN User AS u ON u.email = m.email ' +
    'JOIN Section as s ON m.sectionId = s.sectionId ' +
    'LEFT JOIN PepBand as p ON m.pepBandId = p.bandId ' +
    'WHERE memberId=?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        if (!results.length) {
          return res.status(404).send('The member you\'re looking for does not exist');
        }
        const member = {
          memberId: results[0].memberId,
          user: {
            email: results[0].email,
            firstName: results[0].firstName,
            lastName: results[0].lastName,
            role: results[0].role,
          },
          pepBand: {
            bandId: results[0].pepBandId,
            displayName: results[0].displayName,
          },
          section: {
            sectionId: results[0].sectionId,
            name: results[0].name,
          },
          rehearsalConflict: results[0].rehearsalConflict,
        };
        res.jsonp(member);
      }
    },
  );
};

module.exports.getSection = async (req, res) => {
  db.execute(
    'SELECT Member.*, User.*, PepBand.*, Section.*, Term.* FROM Member ' +
    'JOIN User ON Member.email = User.email ' +
    'JOIN Term ON Member.termId = Term.termId ' +
    'JOIN PepBand ON Member.pepBandId = PepBand.bandId ' +
    'JOIN Section ON Member.sectionId = Section.sectionId ' +
    'WHERE Member.sectionId=? AND Term.startDate < NOW() AND ' +
    'Term.endDate > NOW()',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const members = [];
        for (let i = 0; i < results.length; i++) {
          const member = {
            memberId: results[i].memberId,
            user: {
              firstName: results[i].firstName,
              lastName: results[i].lastName,
              email: results[i].email,
              role: results[i].role,
            },
            pepBand: {
              bandId: results[i].pepBandId,
              displayName: results[i].displayName,
            },
            section: {
              sectionId: results[i].sectionId,
              name: results[i].name,
            },
            rehearsalConflict: results[i].rehearsalConflict,
            term: {
              termId: results[i].termId,
              termName: results[i].termName,
              startDate: results[i].startDate,
              endDate: results[i].endDate,
            },
          };
          members.push(member);
        }
        res.send(members);
      }
    },
  );
};

module.exports.getByTermId = async (req, res) => {
  db.execute(
    'SELECT Member.*, firstName, lastName, role, PepBand.displayName, Section.name, termName, startDate, endDate FROM Member ' +
    'JOIN User ON Member.email = User.email ' +
    'LEFT JOIN PepBand on Member.pepBandId = PepBand.bandId ' +
    'JOIN Section on Member.sectionId = Section.sectionId ' +
    'JOIN Term on Member.termId = Term.termId ' +
    'WHERE Member.termId=?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const members = [];
        for (let i = 0; i < results.length; i++) {
          const member = {
            memberId: results[i].memberId,
            user: {
              firstName: results[i].firstName,
              lastName: results[i].lastName,
              email: results[i].email,
              role: results[i].role,
            },
            pepBand: {
              bandId: results[i].pepBandId,
              displayName: results[i].displayName,
            },
            section: {
              sectionId: results[i].sectionId,
              name: results[i].name,
            },
            rehearsalConflict: results[i].rehearsalConflict,
            term: {
              termId: results[i].termId,
              termName: results[i].termName,
              startDate: results[i].startDate,
              endDate: results[i].endDate,
            },
          };
          members.push(member);
        }
        res.send(members);
      }
    },
  );
};
