/* eslint-disable no-unused-vars */
const webpush = require('web-push');
const url = require('url');
const errors = require('feathers-errors');

const subscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/fYwntmnmBdQ:APA91bEmrnbt0SSfK1xa2wXvgW3c21DUvvIsEvqg_3J9S_LRRVIyeWT7jUXV9RXg_4j2r1U74CO2J53IOl9TqXibhAbsGDCo908X5n7VndEJT1riB3GD_a0_exj19Perhq_8l3lHeuub',
  keys: {
    auth: 'MCWHEreX4-rccxOuFSK9TQ==',
    p256dh: 'BFwD9P75z91H163ij0QVMVMbTjaUCb9aqiigUy-M_X29K6seFBNtxrzgI32yvv3RyAPs_c_UJarfdaoS-ucfpQI='
  }
}

class Service {
  constructor (options) {
    this.options = options || {};

    /* web-push setup */
    this.webpush = webpush;
    this.webpush.setGCMAPIKey(this.options.pushConfig.gcm_sender_id);
    this.webpush.setVapidDetails(
      this.options.pushConfig.subject,
      this.options.pushConfig.vapidKeys.publicKey,
      this.options.pushConfig.vapidKeys.privateKey
    );
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    // const urlsafeBase64 = require('urlsafe-base64');
    // const decodedVapidPublicKey = urlsafeBase64.decode('BFx9xYoe2fg5q3j0GUTgbL59MdxMmOIdX0KTRYpntTnIKaZCH0YIObpCo71sX8PiEkliXeYQtQeHZl_PxmC-bYA');
    // console.log('this to be used in subscription in the browser', new Uint8Array(decodedVapidPublicKey));

    const parsedUrl = url.parse(subscription.endpoint);
    const audience = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    const headers = this.webpush.getVapidHeaders(
      audience,
      this.options.pushConfig.subject,
      this.options.pushConfig.vapidKeys.publicKey,
      this.options.pushConfig.vapidKeys.privateKey
    );

    const encryptedPayload = this.webpush.encrypt(
      subscription.keys.p256dh,
      subscription.keys.auth,
      'my fucking payloaf for notification'
    );

    let requestDetails;
    try {
      requestDetails = this.webpush.generateRequestDetails(
        subscription,
        'my fucking payloaf for notification',
        {
          gcmAPIKey: this.options.pushConfig.gcm_sender_id,
          vapidDetails: {
            subject: this.options.pushConfig.subject,
            publicKey: this.options.pushConfig.vapidKeys.publicKey,
            privateKey: this.options.pushConfig.vapidKeys.privateKey
          },
          TTL: 60
        }
      );
    } catch (error) {
      return Promise.reject(new errors.GeneralError('generating push notification request error', error));
    }

    console.log('headers', headers);
    console.log('payload', encryptedPayload);
    console.log('requets details', requestDetails);

    // execute push notification
    return this.webpush.sendNotification(subscription, 'my fucking payloaf for notification').then(resp => {
      return Promise.resolve(resp);
    }).catch(error => {
      return Promise.reject(new errors.GeneralError('FCM error', error));
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
