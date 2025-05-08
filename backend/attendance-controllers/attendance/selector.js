const db = require('../../config/db');

/**
 * Event selectors
 */

module.exports.getAll = async (req, res) => {
  db.execute(
    'SELECT * FROM MBEvent ORDER BY date',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getRecent = async (req, res) => {
  db.execute(
    'SELECT * FROM MBEvent WHERE date < DATE_ADD(NOW(), interval 1 hour) ORDER BY date',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getUpcoming = async (req, res) => {
  db.execute(
    'SELECT * FROM MBEvent WHERE date >= DATE_ADD(NOW(), interval 1 hour) ORDER BY date',
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};

module.exports.getById = async (req, res) => {
  db.execute('SELECT * FROM MBEvent WHERE eventId=?',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results[0]);
    });
};

// get all members expected at this event (group 'groupID' with specified substitutions)
module.exports.getEventMembers = async (req, res) => {
  db.execute(
    'select Member.* from Member join MBEvent on Member.pepBandId = MBEvent.pepBandId '
      + 'where MBEvent.eventId=?',
    [req.params.id],
    (err, results) => {
      if (err) console.log(err);
      res.jsonp(results);
    },
  );
};
