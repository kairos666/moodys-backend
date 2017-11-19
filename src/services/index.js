const pushNotification = require('./push-notification/push-notification.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(pushNotification);
};
