/* eslint-disable no-unused-vars */
const axios = require('axios');
const errors = require('feathers-errors'); 

class Service {
  constructor (options) {
    this.options = options || {};
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    // send to FCM push service and handle response
    return axios({
      method: 'post',
      url: `https://fcm.googleapis.com${data.path}`,
      headers: {
        'TTL': 60,
        'Authorization': data.vapid
      }
    }).then(resp => {
      return Promise.resolve({
        status: resp.status,
        statusText: resp.statusText
      });
    }).catch(error => {
      return Promise.reject(new errors.GeneralError('FCM error'));
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
