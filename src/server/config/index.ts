import { config } from 'dotenv';

config();

const NodeEnv = process.env.NODE_ENV || 'development';

export const Config = {
  Port: Number(process.env.PORT) || 3000,
  NodeEnv,
  IsDev: NodeEnv === 'development',
  IsProd: NodeEnv === 'production',
  WebConcurrency: process.env.WEB_CONCURRENCY || 1,
  MongoDBURI: process.env.MONGODB_URI,
  SaltRounds: Number(process.env.SALT_ROUNDS),
  SessionSecret: process.env.SESSION_SECRET,
  EnableTransactions: process.env.ENABLE_TRANSACTIONS === 'true' || NodeEnv === 'production',

  SendGrid: {
    Key: process.env.SENDGRID_API_KEY,
    AcceptanceEmailID: process.env.SENDGRID_ACCEPTANCE_EMAIL_ID,
    RejectionEmailID: process.env.SENDGRID_REJECTION_EMAIL_ID,
    WaitlistEmailID: process.env.SENDGRID_WAITLIST_EMAIL_ID
  },

  S3: {
    Key: process.env.S3_KEY,
    Secret: process.env.S3_SECRET,
    Bucket: process.env.S3_BUCKET,
  },

  Mail: {
    Host: process.env.MAIL_HOST,
    Port: Number(process.env.MAIL_PORT),
    User: process.env.MAIL_USER,
    Pass: process.env.MAIL_PASS,
  },
};
