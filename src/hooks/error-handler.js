// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('winston');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function errorHandler (hook) {
    logger.error(`Error in '${hook.path}' service method '${hook.method}`, (hook.error) ? hook.error.stack : 'no error stack');

    return Promise.resolve(hook);
  };
};
