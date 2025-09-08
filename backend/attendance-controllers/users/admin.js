const db = require('../../config/db');
const stream = require("stream");
const csv = require("csv-parser");

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

module.exports.assignRole = async (req, res) => {
  const email = req.body.email;
  const role = req.body.role;
  db.execute('UPDATE User SET role=? WHERE email=?',
    [role, email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
      return res.send(result);
    });
};

module.exports.uploadRolesCsv = async (req, res) => {
  console.log(req.body);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const parsedUsers = [];
  const { emailsToSkip } = req.body;

  // Convert buffer to string, remove BOM if present, then convert back to buffer
  const rawCsvString = req.file.buffer.toString('utf8').replace(/^\uFEFF/, '');
  const cleanedBuffer = Buffer.from(rawCsvString, 'utf8');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(cleanedBuffer);
  bufferStream.pipe(csv()).on('data', (row) => {
    const email = row.Email?.trim().toLowerCase() ?? '';
    const role = row.Role?.trim() ?? '';

    const regex = /^.*<(.*)>.*$/;
    if (!(emailsToSkip.includes(email))) {
      const formattedEmail = email.replace(regex, '$1');
      const user = {
        email: formattedEmail,
        role,
      };
      parsedUsers.push(user);
      console.log(user);
    }
  })
    .on('end', () => {
      console.log('Parsed CSV:', parsedUsers);
      // make sure all the emails belong to users
      const emails = parsedUsers.map((user) => user.email);
      const placeholders = emails.map(() => 'SELECT ? AS email').join(' UNION ALL ');

      const selectString = `SELECT input_emails.email FROM (${placeholders}) AS input_emails
            LEFT JOIN User ON input_emails.email = User.email
            WHERE User.email IS NULL`;
      const params = [...emails];
      db.execute(selectString, params, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
        if (results.length) {
          // some emails from the csv file do not have users attached to them
          return res.status(422).send(results);
        }
        // now update the members
        let roleClause = 'CASE email ';
        let emailString = '';
        const emailParams = [];
        const roleParams = [];
        parsedUsers.forEach((member) => {
          roleClause += 'WHEN ? THEN ? ';
          roleParams.push(member.email);
          roleParams.push(member.role);
          emailString += '?, ';
          emailParams.push(member.email);
        });
        roleClause += 'END ';
        emailString = emailString.slice(0, -2);
        const updateString = `UPDATE User SET role=${roleClause} WHERE email IN (${emailString})`;
        db.execute(updateString, roleParams.concat(emailParams), (err2, result) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2.message);
          } else {
            res.send(result);
          }
        });
      });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      return res.status(500).json({ error: 'Failed to parse CSV' });
    });
};

