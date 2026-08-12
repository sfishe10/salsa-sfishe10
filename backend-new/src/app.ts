import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import passport from 'passport';
import {
  BearerStrategy,
  IBearerStrategyOptionWithRequest,
  VerifyCallback
} from 'passport-azure-ad';

// Route imports

import attendanceRoutes from './routes/attendance';
import eventRoutes from './routes/events';
import memberRoutes from './routes/members';
import termRoutes from './routes/terms';
import pepBandRoutes from './routes/pep-bands';
import sectionRoutes from './routes/sections';
import userRoutes from './routes/users';
import stationsRoutes from './routes/stations';
import evaluationRoutes from './routes/evaluations';

// Database import
import {db} from "./data-source";
import {UserService} from "./services/user.service";
import {MemberService} from "./services/member.service";
import {User} from "./entities/user.entity";
import {Member} from "./entities/member.entity";
import {NotFoundError} from "./errors/not-found-error";
import {Term} from "./entities/term.entity";
import {TermService} from "./services/term.service";

db.initialize()
    .then(() => {
      console.log('Database connected');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });

const app = express();
const port = process.env.PORT || 3001;

// Type extension for Passport user info
interface AuthenticatedRequest extends Request {
  user?: any;
}

// ----- Express Configuration -----
app.disable('etag');

const corsOptions = {
  origin: [
    'https://807.band',
    'https://807.band:444',
    'http://localhost:3000',
    'http://localhost:4200'
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.options('*', cors({
  ...corsOptions,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    console.log(`Received OPTIONS request for ${req.originalUrl} from origin ${req.headers.origin}`);
    res.header("Access-Control-Allow-Origin", req.headers.origin || '');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Error Handlers -----
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// ----- Passport Azure AD -----
const bearerOptions: IBearerStrategyOptionWithRequest = {
  identityMetadata: `${process.env.AUTHORITY}/${process.env.VERSION}/${process.env.DISCOVERY}`,
  issuer: `${process.env.AUTHORITY}/${process.env.VERSION}`,
  clientID: process.env.AUDIENCE || '',
  audience: process.env.AUDIENCE,
  validateIssuer: process.env.VALIDATE_ISSUER === 'true',
  passReqToCallback: process.env.PASS_REQ_TO_CALLBACK === 'true',
  loggingLevel: process.env.LOGGING_LEVEL as any,
  scope: process.env.SCOPE ? [process.env.SCOPE] : [],
};

passport.use(new BearerStrategy(bearerOptions, (token: any, done: VerifyCallback) => {
  console.log('Decoded token:', JSON.stringify(token, null, 2));
  done(null, token, token);
}));

app.use(passport.initialize());

// ----- Routes -----

app.use('/api/attendance/', attendanceRoutes);
app.use('/api/events/', passport.authenticate('oauth-bearer', { session: false }), eventRoutes);
app.use('/api/members/', passport.authenticate('oauth-bearer', { session: false }), memberRoutes);
app.use('/api/terms/', passport.authenticate('oauth-bearer', { session: false }), termRoutes);
app.use('/api/pepBands/', passport.authenticate('oauth-bearer', { session: false }), pepBandRoutes);
app.use('/api/sections/', passport.authenticate('oauth-bearer', { session: false }), sectionRoutes);
app.use('/api/users/', passport.authenticate('oauth-bearer', { session: false }), userRoutes);
app.use('/api/stations/', passport.authenticate('oauth-bearer', { session: false }), stationsRoutes);
app.use('/api/evaluations/', passport.authenticate('oauth-bearer', { session: false }), evaluationRoutes);

// ----- /api/me -----
app.options('/api/me', cors({
  ...corsOptions,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'OPTIONS']
}));

app.use('/api/me', (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('ETag', Date.now().toString());
  next();
});

const userService: UserService = new UserService();
const memberService: MemberService = new MemberService();
const termService: TermService = new TermService();
app.get('/api/me', passport.authenticate('oauth-bearer', { session: false }), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email =
        req.user?.upn ||
        req.user?.preferred_username ||
        req.user?.unique_name ||
        req.user?.email ||
        (req.query.email as string) ||
        null;

    if (!email) {
      return res.status(401).json({ message: 'Unauthorized: no email found' });
    }

    const user: User | null = await userService.getByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const term: Term = await termService.getCurrentOrClosestTerm();
    const member: Member | null = await memberService.getMemberForTerm(term.termId, email);

    const me = { term, user, member };

    res.send(me);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----- Start Server -----
if (process.env.ENVIRONMENT === 'prod') {
  const httpsServer = https.createServer(
      {
        key: fs.readFileSync('/etc/letsencrypt/live/807.band/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/807.band/fullchain.pem'),
      },
      app
  );
  httpsServer.listen(port, () => console.log(`HTTPS server running on port ${port}`));
} else {
  app.listen(port, () => console.log(`HTTP server running on port ${port}`));
}

