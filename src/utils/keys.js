module.exports = {
  google: {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
  },
  mongoose: {
    URI: process.env.DATA_URI,
  },
  session: {
    cookieKey: process.env.cookieKey,
  },
};