// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const commonHooks = require('feathers-hooks-common');
const errors = require('feathers-errors'); 

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function internalOnly (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    // forbidden call - external
    let externalCall = function() {
      hook.result = null; 
      hook.error = new errors.Forbidden('external call - forbidden'); 
      return Promise.reject(hook.error);
    };

    // authorized call - internal
    let internalCall = function() {
      return Promise.resolve(hook);
    };

    return commonHooks.iffElse(
      commonHooks.isProvider('external'),
      externalCall,
      internalCall
    ).call(this, hook);
  };
};
