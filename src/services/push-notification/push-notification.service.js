// Initializes the `push-notification` service on path `/push-notification`
const createService = require('./push-notification.class.js');
const hooks = require('./push-notification.hooks');
const filters = require('./push-notification.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'push-notification',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/push-notification', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('push-notification');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
