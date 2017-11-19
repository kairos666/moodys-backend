// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const commonHooks = require('feathers-hooks-common');
const auth = require('feathers-authentication');
const errors = require('feathers-errors'); 
const logger = require('winston');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function apiAuthenticate (hook) {
    let externalCallWithApiKey = function() {
      logger.debug('external call - authorization check');
      return auth.hooks.authenticate('apiKey')(hook).then(() => {
        // api key passed check
        return Promise.resolve(hook);
      }).catch(() => {
        // api key failed check
        hook.result = null; 
        hook.error = new errors.Forbidden('no valid api key found in header - x-api-key');
        return Promise.reject(hook.error);
      });
    };
    let externalCallWithoutApiKey = function() {
      // missing authorization header - api key failed check
      logger.debug('external call - missing authorization header');
      hook.result = null; 
      hook.error = new errors.Forbidden('no authorization header found - x-api-key'); 
      return Promise.reject(hook.error);
    };
    let internalCall = function() {
      // internal, no need for api key check
      logger.debug('internal call - no authorization check');
      return Promise.resolve(hook);
    };

    return commonHooks.iffElse(
      commonHooks.isProvider('external'),
      commonHooks.iffElse(
        ctx => ctx.params.headers['x-api-key'],
        externalCallWithApiKey,
        externalCallWithoutApiKey
      ),
      internalCall
    ).call(this, hook);
  };
};
