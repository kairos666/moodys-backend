// Initializes the `subscriptions` service on path `/subscriptions`
const createService = require('./subscriptions.class.js');
const hooks = require('./subscriptions.hooks');
const filters = require('./subscriptions.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'subscriptions',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/subscriptions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('subscriptions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
