const db = require('../../config/db');

module.exports.create = async (req, res) => {
  db.execute('SELECT * FROM User WHERE email=?', [req.body.member.email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        if (!result.length) {
          return res.status(404).send({ message: 'User not found' });
        }
        const { userId } = result[0];
        const user = {
          userId,
          firstName: result[0].firstName,
          lastName: result[0].lastName,
          email: result[0].email,
          role: result[0].role,
        };
        console.log(req.body.member);
        db.execute('INSERT INTO MEMBER(userId, pepBandId, sectionId, termId, rehearsalConflict) VALUES (?, ?, ?, ?, ?)',
          [userId, req.body.member.pepBand.bandId,
            req.body.member.section.sectionId, req.body.member.term.termId, req.body.member.rehearsalConflict],
          (err2, result2) => {
            if (err2) {
              console.log(err2);
              res.status(500).send(err2.message);
            } else {
              const member = {
                memberId: result2.insertId,
                user,
                pepBand: req.body.member.pepBand,
                section: req.body.member.section,
                term: req.body.member.term,
                rehearsalConflict: req.body.member.rehearsalConflict,
              };
              res.send(member);
            }
          });
      }
    });
};
