const stream = require('stream');
const csv = require('csv-parser');
const db = require('../../config/db');
const { REHEARSAL_CONFLICT_ARRIVING_LATE,
REHEARSAL_CONFLICT_LEAVING_EARLY,
REHEARSAL_CONFLICT_OTHER,
REHEARSAL_CONFLICT_THURS,
REHEARSAL_CONFLICT_TUES} = require('../../utilities/constants');

module.exports.create = async (req, res) => {
  const { email } = req.body.member;
  const pepBandId = req.body.member.pepBand ? req.body.member.pepBand.bandId : null;
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
        db.execute('INSERT INTO Member(email, pepBandId, sectionId, termId, rehearsalConflict) VALUES (?, ?, ?, ?, ?)',
          [email, pepBandId, req.body.member.section.sectionId, req.body.member.term.termId,
            req.body.member.rehearsalConflict],
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
              db.execute('CALL AddAttendancesForNewMembers(?)', [req.body.member.term.termId], (err3) => {
                if (err3) {
                  console.error(err3);
                  return res.status(500).send(err3.message);
                }
                res.send(member);
              });
            }
          });
      }
    });
};

module.exports.update = async (req, res) => {
  const { member } = req.body;
  console.log(member);
  const pepBandId = req.body.member.pepBand ? req.body.member.pepBand.bandId : null;

  db.execute('SELECT pepBandId FROM Member WHERE memberId=?',
    [member.memberId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      } else {
        const oldPepBandId = result[0].pepBandId;

        db.execute('UPDATE Member SET sectionId=?, pepBandId=?, rehearsalConflict=? WHERE memberId=?',
          [member.section.sectionId, pepBandId, member.rehearsalConflict, member.memberId],
          (err2, result2) => {
            if (err2) {
              console.log(err2);
              res.status(500).send(err2.message);
            } else {
              const newMemberData = {
                memberId: member.memberId,
                user: member.user,
                section: member.section,
                pepBand: member.pepBand,
                rehearsalConflict: member.rehearsalConflict,
                term: member.term,
              };
              if (!member.pepBand || oldPepBandId !== member.pepBand?.bandId) {
                // if the pep band has changed, delete any attendances that have not been submitted yet
                // and create new attendances for the new pep band
                db.execute('DELETE ea '
                  + 'FROM EventAttendance ea '
                  + 'JOIN MBEvent e ON ea.eventId = e.eventId '
                  + 'WHERE ea.memberId=? AND ea.attendance IS NULL AND e.pepBandId=?',
                [member.memberId, oldPepBandId],
                (err3, result3) => {
                  if (err3) {
                    console.log(err3);
                    res.status(500).send(err3.message);
                  } else {
                    if (member.pepBand) {
                      db.execute('CALL ReassignRemainingPepEventsForMember(?, ?, ?, ?)',
                        [member.term.termId, member.memberId, member.pepBand.bandId, member.pepBand.sectionId],
                        (err4, result4) => {
                          if (err4) {
                            console.log(err4);
                            res.status(500).send(err4.message);
                          } else {
                            return res.send(newMemberData);
                          }
                        });
                    }
                  }
                });
              } else {
                res.send(newMemberData);
              }
            }
          });
      }
    });
};

module.exports.delete = async (req, res) => {
  db.execute('DELETE FROM EventAttendance WHERE memberId=?', [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err.message);
      }
      db.execute('DELETE FROM Member WHERE memberId=?', [req.params.id],
        (err2, result2) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2.message);
          } else {
            res.send(result2);
          }
        });
    });
};

module.exports.uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const parsedMembers = [];
  const sections = new Map();

  // Convert buffer to string, remove BOM if present, then convert back to buffer
  const rawCsvString = req.file.buffer.toString('utf8').replace(/^\uFEFF/, '');
  const cleanedBuffer = Buffer.from(rawCsvString, 'utf8');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(cleanedBuffer);
  bufferStream.pipe(csv()).on('data', (row) => {
    const officialLastName = row['Official Last']?.trim() ?? '';
    const officialFirstName = row['Official First']?.trim() ?? '';
    const preferredLastName = row['Preferred Last']?.trim() ?? '';
    const preferredFirstName = row['Preferred First']?.trim() ?? '';
    // for extended ed students without a CP email, use their preferred email for now -
    // they will not be needing to log in, so it won't cause problems
    const email = row.Email?.trim() !== 'anonymous' ? row.Email?.trim() : row['Preferred Email'].trim();
    const sectionName = row.Section?.trim() ?? '';
    const sectionId = parseInt(row.Sort?.trim());

    const lastName = preferredLastName === '0' ? officialLastName : preferredLastName;
    const firstName = preferredFirstName === '0' ? officialFirstName : preferredFirstName;

    if (email !== 'anonymous') {
      const member = {
        lastName,
        firstName,
        email,
        sectionId,
      };
      parsedMembers.push(member);
      sections.set(sectionId, sectionName);
    }
  })
    .on('end', () => {
      let insertSectionsString = 'INSERT IGNORE INTO Section (sectionId, name) VALUES ';
      const sectionParams = [];
      sections.forEach((name, id) => {
        insertSectionsString += '(?, ?), ';
        sectionParams.push(id);
        sectionParams.push(name);
      });
      // remove last comma and space
      insertSectionsString = insertSectionsString.slice(0, -2);
      db.execute(insertSectionsString, sectionParams, (err2) => {
        if (err2) {
          console.log(err2);
          res.status(500).send(err2.message);
        } else {
          // insert the users if they don't exist
          let insertString = 'INSERT INTO User (email, firstName, lastName, role) VALUES ';
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

          insertString += ' ON DUPLICATE KEY UPDATE firstName = VALUES(firstName), ' +
            'lastName = VALUES(lastName), role = VALUES(role)';
          db.execute(insertString, params, (err3) => {
            if (err3) {
              console.log(err3);
              res.status(500).send(err3.message);
            } else {
              // now insert the members
              insertString = 'INSERT INTO Member (email, sectionId, termId, rehearsalConflict, pepBandId) VALUES ';
              params = [];
              parsedMembers.forEach((member) => {
                insertString += '(?, ?, ?, NULL, NULL), ';
                params.push(member.email);
                params.push(member.sectionId);
                params.push(req.params.id);
              });

              // remove last comma and space
              insertString = insertString.slice(0, -2);

              insertString += ' ON DUPLICATE KEY UPDATE sectionId = VALUES(sectionId)';
              db.execute(insertString, params, (err4, result) => {
                if (err4) {
                  console.log(err4);
                  res.status(500).send(err4.message);
                } else {
                  // in case events have already been created, create blank EventAttendance objects for each new member
                  db.execute('CALL AddAttendancesForNewMembers(?)', [req.params.id], (err5) => {
                    if (err5) {
                      console.error(err5);
                      return res.status(500).send(err5.message);
                    }
                    res.send(result);
                  });
                }
              });
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

module.exports.uploadPepBandsCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const parsedMembers = [];
  const { emailsToSkip } = req.body;

  // Convert buffer to string, remove BOM if present, then convert back to buffer
  const rawCsvString = req.file.buffer.toString('utf8').replace(/^\uFEFF/, '');
  const cleanedBuffer = Buffer.from(rawCsvString, 'utf8');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(cleanedBuffer);
  bufferStream.pipe(csv()).on('data', (row) => {
    const email = row.Email?.trim().toLowerCase() ?? '';
    const pepBandId = row['Pep Band']?.trim().toUpperCase() ?? '';
    if (!(emailsToSkip.includes(email))) {
      const member = {
        email,
        pepBandId,
      };
      parsedMembers.push(member);
    }
  })
    .on('end', () => {
      console.log('Parsed CSV:', parsedMembers);
      // make sure all the emails belong to members in that term
      const emails = parsedMembers.map((member) => member.email);
      const placeholders = emails.map(() => 'SELECT ? AS email').join(' UNION ALL ');

      const selectString = `SELECT input_emails.email FROM (${placeholders}) AS input_emails
            LEFT JOIN Member ON input_emails.email = Member.email AND Member.termId = ?
            WHERE Member.email IS NULL`;
      const params = [...emails, req.params.id];
      db.execute(selectString, params, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
        if (results.length) {
          // some emails from the csv file do not have members attached to them in this term
          return res.status(422).send(results);
        }
        // now update the members
        let pepBandClause = 'CASE email ';
        let emailString = '';
        const emailParams = [];
        const pepBandParams = [];
        parsedMembers.forEach((member) => {
          pepBandClause += 'WHEN ? THEN ? ';
          pepBandParams.push(member.email);
          pepBandParams.push(member.pepBandId);
          emailString += '?, ';
          emailParams.push(member.email);
        });
        pepBandClause += 'END ';
        emailString = emailString.slice(0, -2);
        const updateString = `UPDATE Member SET pepBandId=${pepBandClause} WHERE email IN (${emailString})`;
        db.execute(updateString, pepBandParams.concat(emailParams), (err2, result) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2.message);
          } else {
            db.execute('CALL AddAttendancesForNewMembers(?)', [req.params.id], (err3) => {
              if (err3) {
                console.error(err3);
                return res.status(500).send(err3.message);
              }
              res.send(result);
            });
          }
        });
      });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      return res.status(500).json({ error: 'Failed to parse CSV' });
    });
};

module.exports.uploadRehearsalConflictsCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const parsedMembers = [];
  const { emailsToSkip } = req.body;

  // Convert buffer to string, remove BOM if present, then convert back to buffer
  const rawCsvString = req.file.buffer.toString('utf8').replace(/^\uFEFF/, '');
  const cleanedBuffer = Buffer.from(rawCsvString, 'utf8');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(cleanedBuffer);
  bufferStream.pipe(csv()).on('data', (row) => {
    const email = row.Email2?.trim().toLowerCase() ?? '';
    const tuesdayArriveLate = row['Tuesday Rehearsal']?.toLowerCase().includes('arriving late');
    const tuesdayLeaveEarly = row['Tuesday Rehearsal']?.toLowerCase().includes('leaving early');
    const thursdayArriveLate = row['Thursday Rehearsal']?.toLowerCase().includes('arriving late');
    const thursdayLeaveEarly = row['Thursday Rehearsal']?.toLowerCase().includes('leaving early');

    if (!(emailsToSkip.includes(email))
        && !(!tuesdayArriveLate && !tuesdayLeaveEarly && !thursdayLeaveEarly && !thursdayArriveLate)) {
      let rehearsalConflict = '';
      if (tuesdayArriveLate && thursdayArriveLate && !tuesdayLeaveEarly && !thursdayLeaveEarly) {
        rehearsalConflict = REHEARSAL_CONFLICT_ARRIVING_LATE;
      } else if (tuesdayLeaveEarly && thursdayLeaveEarly && !tuesdayArriveLate && !thursdayArriveLate) {
        rehearsalConflict = REHEARSAL_CONFLICT_LEAVING_EARLY;
      } else if ((tuesdayLeaveEarly || tuesdayArriveLate) && !thursdayLeaveEarly && !thursdayArriveLate) {
        rehearsalConflict = REHEARSAL_CONFLICT_TUES;
      } else if ((thursdayLeaveEarly || thursdayArriveLate) && !tuesdayLeaveEarly && !tuesdayArriveLate) {
        rehearsalConflict = REHEARSAL_CONFLICT_THURS;
      } else {
        rehearsalConflict = REHEARSAL_CONFLICT_OTHER;
      }
      const member = {
        email,
        rehearsalConflict,
      };
      parsedMembers.push(member);
    }
  })
    .on('end', () => {
      console.log('Parsed CSV:', parsedMembers);
      // make sure all the emails belong to members in that term
      const emails = parsedMembers.map((member) => member.email);
      const placeholders = emails.map(() => 'SELECT ? AS email').join(' UNION ALL ');

      const selectString = `SELECT input_emails.email FROM (${placeholders}) AS input_emails
            LEFT JOIN Member ON input_emails.email = Member.email AND Member.termId = ?
            WHERE Member.email IS NULL`;
      const params = [...emails, req.params.id];
      db.execute(selectString, params, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
        if (results.length) {
          // some emails from the csv file do not have members attached to them in this term
          return res.status(422).send(results);
        }
        // now update the members
        let rehearsalConflictClause = 'CASE email ';
        let emailString = '';
        const emailParams = [];
        const rehearsalConflictParams = [];
        parsedMembers.forEach((member) => {
          rehearsalConflictClause += 'WHEN ? THEN ? ';
          rehearsalConflictParams.push(member.email);
          rehearsalConflictParams.push(member.rehearsalConflict);
          emailString += '?, ';
          emailParams.push(member.email);
        });
        rehearsalConflictClause += 'END ';
        emailString = emailString.slice(0, -2);
        const updateString = `UPDATE Member SET rehearsalConflict=${rehearsalConflictClause} WHERE email IN (${emailString})`;
        db.execute(updateString, rehearsalConflictParams.concat(emailParams), (err2, result) => {
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
