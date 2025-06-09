const db = require('../../config/db');

module.exports.create = async (req, res) => {
  db.execute('SELECT * FROM User WHERE email=?', [req.body.user.email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        if (result.length) {
          return res.status(409).json({ message: 'Email already in use' });
        }
        db.execute('INSERT INTO User(email, firstName, lastName, role) VALUES (?, ?, ?, ?)',
          [req.body.user.email, req.body.user.firstName, req.body.user.lastName, req.body.user.role],
          (err2, result2) => {
            if (err2) {
              console.log(err2);
              res.status(500).send(err2.message);
            } else {
              const user = {
                userId: result2.insertId,
                firstName: req.body.user.firstName,
                lastName: req.body.user.lastName,
                email: req.body.user.email,
                role: req.body.user.role,
              };
              res.send(user);
            }
          });
      }
    });
};
