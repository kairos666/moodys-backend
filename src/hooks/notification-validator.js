// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('winston');
const errors = require('feathers-errors'); 
const Ajv = require('ajv');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function notificationValidator (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    // Schemes
    const Notif = {
      $id: 'Notif',
      properties: {
        title: { type: 'string' },
        options: { $ref: 'NotifOptions', type: 'object' }
      },
      required: ['title']
    }

    const NotifOptions = {
      $id: 'NotifOptions',
      properties: {
        badge: { type: 'string', format: 'uri-template' },
        icon: { type: 'string', format: 'uri-template' },
        body: { type: 'string' },
        tag: { type: 'string' }
      }
    }

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
