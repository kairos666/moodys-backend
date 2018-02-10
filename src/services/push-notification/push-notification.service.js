// Initializes the `push-notification` service on path `/push-notification`
const createService = require('./push-notification.class.js');
const hooks = require('./push-notification.hooks');
const filters = require('./push-notification.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const pushConfig = app.get('push-notification');

  const options = {
    name: 'push-notification',
    paginate,
    pushConfig
  };
  const pushService = createService(options);

  // swagger spec for this service
  pushService.docs = { 
    create: { 
      parameters: [ 
        { 
          description: 'push notification payload', 
          in: 'body', 
          name: 'payload', 
          type: 'object' 
        }, 
        { 
          description: 'push notification parameters', 
          in: 'query', 
          name: '$someParam', 
          type: 'string' 
        } 
      ] 
    } 
  };

  // Initialize our service with any options it requires
  app.use('/push-notification', pushService);

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('push-notification');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
