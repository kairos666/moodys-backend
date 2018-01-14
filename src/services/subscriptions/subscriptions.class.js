/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return this.options.pGetAllSubscriptions();
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
