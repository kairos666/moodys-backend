// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('winston');
const errors = require('feathers-errors'); 
const Ajv = require('ajv');

// schemes
const Notif = require('../schemas/Notif.schema');
const NotifOptions = require('../schemas/NotifOptions.schema');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function notificationValidator (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    // init JSON schema validator (adding necessary sub schemes)
    const ajv = new Ajv();
    ajv.addSchema(NotifOptions);

    // perform validation
    if (ajv.validate(Notif, hook.data)) {
      // validation success
      logger.debug('notification schema validated', hook.data);
      return Promise.resolve(hook);
    } else {
      // validation failed
      hook.result = null; 
      hook.error = new errors.NotAcceptable('data not valid - Notif Schema', ajv.errors);
      logger.debug('notification schema invalid', hook.data, ajv.errors);
      return Promise.reject(hook.error);
    }
  };
};
