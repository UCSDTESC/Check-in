require('dotenv').config();

module.exports = {
  url: process.env.MONGODB_URI,
  directory: 'migrations'
};
