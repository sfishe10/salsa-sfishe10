const stream = require('stream');
const csv = require('csv-parser');
const db = require('../../config/db');

module.exports.create = async (req, res) => {
  const email = req.body.member.email;
  console.log(email);
    db.execute('SELECT * FROM User WHERE email=?', [email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        if (!result.length) {
          return res.status(404).send({ message: 'User not found' });
        }
        const user = {
          firstName: result[0].firstName,
          lastName: result[0].lastName,
          email,
          role: result[0].role,
        };
        db.execute('INSERT INTO MEMBER(email, pepBandId, sectionId, termId, rehearsalConflict) VALUES (?, ?, ?, ?, ?)',
          [email, req.body.member.pepBand.bandId,
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

module.exports.uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const parsedMembers = [];

  // Convert buffer to string, remove BOM if present, then convert back to buffer
  const rawCsvString = req.file.buffer.toString('utf8').replace(/^\uFEFF/, '');
  const cleanedBuffer = Buffer.from(rawCsvString, 'utf8');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(cleanedBuffer);
  bufferStream.pipe(csv()).on('data', (row) => {
    const lastName = row['Last Name']?.trim() ?? '';
    const firstName = row['First Name']?.trim() ?? '';
    const email = row.Email?.trim() ?? '';
    const section = row.Section?.trim() ?? '';
    const member = {
      lastName,
      firstName,
      email,
      section,
    };
    parsedMembers.push(member);
  })
    .on('end', () => {
      console.log('Parsed CSV:', parsedMembers);
      // insert the users if they don't exist
      let insertString = 'INSERT IGNORE INTO User (email, firstName, lastName, role) VALUES ';
      let params = [];
      parsedMembers.forEach((member) => {
        insertString += '(?, ?, ?, ?), ';
        params.push(member.email);
        params.push(member.firstName);
        params.push(member.lastName);
        params.push('Member');
      });
      // remove last comma and space
      insertString = insertString.slice(0, -2);
      db.execute(insertString, params, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err.message);
        } else {
          // now insert the members
          insertString = 'INSERT IGNORE INTO Member (email, sectionId, termId, rehearsalConflict, pepBandId) VALUES ';
          params = [];
          parsedMembers.forEach((member) => {
            insertString += '(?, ' +
              '(SELECT sectionId FROM Section where Section.name = ?), ' +
              '?, NULL, NULL), ';
            params.push(member.email);
            params.push(member.section);
            params.push(req.params.id);
          });

          // remove last comma and space
          insertString = insertString.slice(0, -2);
          db.execute(insertString, params, (err2, result) => {
            if (err2) {
              console.log(err2);
              res.status(500).send(err2.message);
            } else {
              res.send(result);
            }
          });
        }
      });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(500).json({ error: 'Failed to parse CSV' });
    });
};
