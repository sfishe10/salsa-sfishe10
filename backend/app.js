const express = require('express');
const cors = require('cors');
const multer = require('multer');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const passport = require('passport');
const { BearerStrategy } = require('passport-azure-ad');
const groupsRoutes = require('./routes/groups.js');
const stationRoutes = require('./routes/stations.js');
const userRoutes = require('./routes/users.js');
const sectionRoutes = require('./routes/sections');
const evaluationRoutes = require('./routes/evaluations');
const eventRoutes = require('./routes/events');

const attendanceRoutes = require('./attendance-routes/attendance');
const attendanceEventRoutes = require('./attendance-routes/events');
const attendanceMemberRoutes = require('./attendance-routes/members');
const attendanceTermRoutes = require('./attendance-routes/terms');
const attendancePepBandRoutes = require('./attendance-routes/pep-bands');
const attendanceSectionRoutes = require('./attendance-routes/sections');

const app = express();
const port = process.env.PORT || 3001;
const upload = multer();
const db = require('./config/db');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.single('file'));

passport.use(new BearerStrategy({
  // Passport will use this URL to fetch the token validation information from Azure AD
  identityMetadata: `${process.env.AUTHORITY}/${process.env.VERSION}/${process.env.DISCOVERY}`,
  issuer: `${process.env.AUTHORITY}/${process.env.VERSION}`,
  clientID: process.env.AUDIENCE,
  audience: process.env.AUDIENCE, // the identifier of the resource that the client wants to access.
  validateIssuer: process.env.VALIDATE_ISSUER === 'true',
  passReqToCallback: process.env.PASS_REQ_TO_CALLBACK === 'true',
  loggingLevel: process.env.LOGGING_LEVEL,
  scope: [process.env.SCOPE],
},
((token, done) => done(null, token, token))));

app.use(cors({ origin: ['https://807.band', 'http://localhost:3000', 'http://localhost:4200'], credentials: true }));
app.use(passport.authenticate('oauth-bearer', { session: false }));
app.use('/api/groups/', groupsRoutes);
app.use('/api/station/', stationRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/section/', sectionRoutes);
app.use('/api/evaluations/', evaluationRoutes);
app.use('/api/event/', eventRoutes);

app.use('/api/mb-attendance/attendance/', attendanceRoutes);
app.use('/api/mb-attendance/events/', attendanceEventRoutes);
app.use('/api/mb-attendance/members/', attendanceMemberRoutes);
app.use('/api/mb-attendance/terms/', attendanceTermRoutes);
app.use('/api/mb-attendance/pepBands/', attendancePepBandRoutes);
app.use('/api/mb-attendance/sections/', attendanceSectionRoutes);

app.get('/api/me',
  async (req, res) => {
    db.execute('SELECT * FROM User WHERE email = ?', [req.user.upn],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send(err.message);
        }
        if (!result.length) return res.status(404).json({ message: 'User not found' });
        const { userId } = result[0];
        const user = {
          userId,
          firstName: result[0].firstName,
          lastName: result[0].lastName,
          email: result[0].email,
          role: result[0].role,
        };
        db.execute('SELECT * FROM Member as m '
          + 'JOIN Term AS t ON m.termId = t.termId '
          + 'JOIN PepBand AS p ON m.pepBandId = p.bandId '
          + 'JOIN Section AS s ON m.sectionId = s.sectionId '
          + 'WHERE userId = ? AND '
          + 't.startDate <= NOW() AND t.endDate >= NOW()', [userId],
        (err2, result2) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err.message);
          }
          let member;
          if (result2.length) {
            member = {
              memberId: result2[0].memberId,
              user,
              pepBand: {
                bandId: result2[0].pepBandId,
                displayName: result2[0].displayName,
              },
              section: {
                sectionId: result2[0].sectionId,
                name: result2[0].name,
              },
              rehearsalConflict: result2[0].rehearsalConflict,
            };
          }
          const me = {
            user,
            member,
          };
          res.send(me);
        });
      });
  });

if (process.env.ENVIRONMENT === 'prod') {
  const httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/807.band/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/807.band/fullchain.pem'),
  }, app);

  httpsServer.listen(port, () => console.log(`Server running on port ${port}`));
} else {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
