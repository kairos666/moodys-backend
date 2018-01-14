const auth = require('feathers-authentication');
const passportApiKey = require('./strategy/api-key');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(auth(config));
  app.configure(passportApiKey(config.apiKey));
};
   