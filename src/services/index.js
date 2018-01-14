const pushNotification = require('./push-notification/push-notification.service.js');
const subscriptions = require('./subscriptions/subscriptions.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(pushNotification);
  app.configure(subscriptions);
};
