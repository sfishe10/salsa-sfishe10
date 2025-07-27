const db = require('../../config/db');

module.exports.create = async (req, res) => {
  db.execute('SELECT * FROM User WHERE email=?', [req.body.user.email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
      if (result.length) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      db.execute('INSERT INTO User(email, firstName, lastName, role) VALUES (?, ?, ?, ?)',
        [req.body.user.email, req.body.user.firstName, req.body.user.lastName, req.body.user.role],
        (err2) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2.message);
          } else {
            res.send(req.body.user);
          }
        });
    });
};

module.exports.update = async (req, res) => {
  const { user } = req.body;
  db.execute('UPDATE User SET firstName=?, lastName=?, role=? WHERE email=?',
    [user.firstName, user.lastName, user.role, user.email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
      return res.send(result);
    });
};
