import dotenv from 'dotenv';

dotenv.config({debug: process.env.NODE_ENV !== 'development'});

export const Config = {
  Port: Number(process.env.PORT) || 3000,
  NodeEnv: process.env.NODE_ENV,
  WebConcurrency: process.env.WEB_CONCURRENCY || 1,
  MongoDBURI: process.env.MONGODB_URI,
  SaltRounds: Number(process.env.SALT_ROUNDS),
  SessionSecret: process.env.SESSION_SECRET,

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
