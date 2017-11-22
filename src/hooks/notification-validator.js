// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('winston');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function notificationValidator (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations

    // notification object type check
    // let notifScheme = {
    //   title: 'string',
    //   options: {
    //     badge: 'relative url of an image - android minimized notif 96x96 PNG',
    //     icon: 'relative url of an image - displayed inside notif 256x256 PNG',
    //     body: 'string',
    //     tag: 'string'
    //   }
    // }
    logger.info('notification validation', hook.data);
    return Promise.resolve(hook);
  };
};
