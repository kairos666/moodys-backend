// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('feathers-errors');
const logger = require('winston'); 

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateSubsrciptions (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    // get subscriptions
    return hook.app.service('subscriptions').find().then(wpSubscriptions => {
      // success but no subscriptions were found - early break
      if (!wpSubscriptions) {
        hook.result = null;
        hook.error = new errors.Unavailable('Couldn\'t find any valid subscriptions');
        return Promise.reject(hook.error);
      }
      // pass on subscriptions
      let wpPayload = JSON.stringify(hook.data);
      hook.data = Object.assign({}, {
        notification: wpPayload,
        subscriptions: wpSubscriptions
      });
      logger.debug('hook populate-subscriptions - successfully retrieved subscriptions');
      return Promise.resolve(hook);
    }).catch(err => {
      // failed retrieving subscriptions
      hook.result = null;
      hook.error = err; 
      return Promise.reject(hook.error);
    });
  };
};
