const express = require('express');
const cors = require('cors');
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
const attendanceRoutes = require('./routes/attendance');

const angularAttendanceRoutes = require('./attendance-routes/attendance');
const attendanceEventRoutes = require('./attendance-routes/events');
const attendanceMemberRoutes = require('./attendance-routes/members');
const attendanceTermRoutes = require('./attendance-routes/terms');
const attendancePepBandRoutes = require('./attendance-routes/pep-bands');
const attendanceSectionRoutes = require('./attendance-routes/sections');
const attendanceUserRoutes = require('./attendance-routes/users');

const app = express();
const port = process.env.PORT || 3001;
const db = require('./config/db');

dotenv.config();

app.disable('etag');

app.use(cors({ origin: ['https://807.band', 'https://807.band:444', 'http://localhost:3000', 'http://localhost:4200'], credentials: true }));

app.options('*', cors({
  origin: ['https://807.band', 'https://807.band:444', 'http://localhost:3000', 'http://localhost:4200'],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log(`Received OPTIONS request for ${req.originalUrl} from origin ${req.headers.origin}`);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

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
(token, done) => {
  console.log('Decoded token:', JSON.stringify(token, null, 2));
  done(null, token, token);
}));

app.use(passport.initialize());

app.use('/api/groups/', groupsRoutes);
app.use('/api/station/', stationRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/section/', sectionRoutes);
app.use('/api/evaluations/', evaluationRoutes);
app.use('/api/event/', eventRoutes);
app.use('/api/attendance/', attendanceRoutes);

app.use('/api/mb-attendance/attendance/', angularAttendanceRoutes);
app.use('/api/mb-attendance/events/', passport.authenticate('oauth-bearer', { session: false }), attendanceEventRoutes);
app.use('/api/mb-attendance/members/', passport.authenticate('oauth-bearer', { session: false }), attendanceMemberRoutes);
app.use('/api/mb-attendance/terms/', passport.authenticate('oauth-bearer', { session: false }), attendanceTermRoutes);
app.use('/api/mb-attendance/pepBands/', passport.authenticate('oauth-bearer', { session: false }), attendancePepBandRoutes);
app.use('/api/mb-attendance/sections/', passport.authenticate('oauth-bearer', { session: false }), attendanceSectionRoutes);
app.use('/api/mb-attendance/users/', passport.authenticate('oauth-bearer', { session: false }), attendanceUserRoutes);

app.options('/api/me', cors({
  origin: ['https://807.band', 'https://807.band:444', 'http://localhost:3000', 'http://localhost:4200'],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'OPTIONS']
}));

app.use('/api/me', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('ETag', Date.now().toString()); // force unique ETag
  next();
});

app.get('/api/me', passport.authenticate('oauth-bearer', { session: false }), async (req, res) => {
  try {
    const email = req.user?.upn || req.user?.preferred_username || req.user?.unique_name || req.user?.email || req.query.email || null;
    if (!email) {
      return res.status(401).json({ message: 'Unauthorized: no email found' });
    }
    db.execute('SELECT * FROM User WHERE email = ?', [email],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
        if (!result.length) return res.status(404).json({ message: 'User not found' });
        const user = {
          firstName: result[0].firstName,
          lastName: result[0].lastName,
          email,
          role: result[0].role,
        };
        db.execute('SELECT * FROM Member as m '
          + 'LEFT JOIN Term AS t ON m.termId = t.termId '
          + 'LEFT JOIN PepBand AS p ON m.pepBandId = p.bandId '
          + 'LEFT JOIN Section AS s ON m.sectionId = s.sectionId '
          + 'WHERE email = ? AND '
          + 't.startDate <= NOW() AND t.endDate >= NOW()', [email],
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
              term: {
                termId: result2[0].termId,
                termName: result2[0].termName,
                startDate: result2[0].startDate,
                endDate: result2[0].endDate,
              },
              rehearsalConflict: result2[0].rehearsalConflict,
            };
          }
          const me = {
            user,
            member,
          };
          console.log("Sending /api/me response:", me);
	  res.json(me);
	  //res.send(me);
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error sad face' });
    }
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
