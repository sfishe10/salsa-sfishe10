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
  identityMetadata: `https://${process.env.AUTHORITY}/${process.env.TENANT_ID}/${process.env.VERSION}/${process.env.DISCOVERY}`,
  issuer: `https://${process.env.AUTHORITY}/${process.env.TENANT_ID}/${process.env.VERSION}`,
  clientID: process.env.AUDIENCE,
  audience: process.env.AUDIENCE, // the identifier of the resource that the client wants to access.
  validateIssuer: process.env.VALIDATE_ISSUER,
  passReqToCallback: process.env.PASS_REQ_TO_CALLBACK,
  loggingLevel: process.env.LOGGING_LEVEL,
  scope: [process.env.SCOPE],
},
((token, done) => {
  console.log('token ', token);
  return done(null, token, token);
})));

app.use(cors({ origin: ['https://807.band', 'http://localhost:3000', 'http://localhost:4200'], credentials: true }));
// app.use(passport.authenticate('oauth-bearer', { session: false }));
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

app.get('/api/me',
  passport.authenticate('oauth-bearer', { session: false }),
  async (req, res) => {
    console.log(req.user);
    const user = await db.query('SELECT * FROM Member WHERE email = ?', [req.user.preferred_username]);
    if (!user.length) return res.status(404).json({ message: 'User not found' });
    return res.json(user[0]);
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
