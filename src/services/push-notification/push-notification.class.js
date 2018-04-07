/* eslint-disable no-unused-vars */
const webpush = require('web-push');
const url = require('url');
const errors = require('feathers-errors');
const axios = require('axios');
const logger = require('winston');

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
    // get sender UID
    let notifContent = (data && data.notification) 
      ? JSON.parse(data.notification) 
      : {};
    let senderUID = (notifContent.options && notifContent.options.data && notifContent.options.data.uid)
      ? notifContent.options.data.uid
      : '<missing sender uid>';

    // format subscriptions array and filter out subscription(s) from caller
    let tempSubscriptions = Object.keys(data.subscriptions)
      .filter(uid => (uid !== senderUID))
      .map(uid => {
        return Object.keys(data.subscriptions[uid]).map(fingerprint => {

          // build notification object with additional target uid for each push message
          let processedNotif = Object.assign({}, JSON.parse(data.notification));
          if (processedNotif.options && processedNotif.options.data) processedNotif.options.data.toUId = uid;

          return {
            notification: JSON.stringify(processedNotif),
            subscription: data.subscriptions[uid][fingerprint]
          };
        });
      });
    let subscriptions = [].concat(...tempSubscriptions);

    // generate request details out of notification data, subscriptions and config
    let preparePushNotif = (pushData, subscription) => {
      let requestDetails;
      try {
        requestDetails = this.webpush.generateRequestDetails(
          subscription,
          pushData,
          {
            gcmAPIKey: this.options.pushConfig.gcm_sender_id,
            vapidDetails: {
              subject: this.options.pushConfig.subject,
              publicKey: this.options.pushConfig.vapidKeys.publicKey,
              privateKey: this.options.pushConfig.vapidKeys.privateKey
            },
            TTL: 60 * 60
          }
        );
      } catch (error) {
        return Promise.reject(new errors.GeneralError('generating push notification request error', error));
      }

      return Promise.resolve(requestDetails);
    };

    // execute push request according to request details
    let executePush = (requestDetails) => {
      // adapt requestDetails to axiosOptions
      let adaptedRequestDetailsToAxios = {
        url: requestDetails.endpoint,
        headers: requestDetails.headers,
        method: requestDetails.method,
        data: requestDetails.body
      };

      return axios.request(adaptedRequestDetailsToAxios);
    };

    // wait for all push requests to be resolved
    let promiseAllSoftFail = function(promisesArray) {
      let promisesFormatedArray = promisesArray.map(p => p.catch(e => e)); 
      return Promise.all(promisesFormatedArray);
    };

    // generate promise for all notificatons to be fired
    let pushPromisesArray = subscriptions.map(wp => preparePushNotif(wp.notification, wp.subscription).then(reqDetails => executePush(reqDetails)));
    return promiseAllSoftFail(pushPromisesArray).then(results => {
      let filteredResults = results.map(response => {
        // filter only useful information
        if (response.status === 200 || response.status === 201) {
          return { status: response.status, statusText: response.statusText };
        } else {
          return { status: response.response.status, statusText: response.response.statusText };
        }
      });

      let groomedResults = {
        totalPush: filteredResults.length,
        totalSuccesssfulPush: filteredResults.filter(resp => (resp.status === 200 || resp.status === 201)).length,
        totalFailedPush: filteredResults.filter(resp => (resp.status !== 200 && resp.status !== 201)).length,
        FCMresponseDetails: filteredResults
      };
      logger.debug(groomedResults);

      /**
       * service call end result
       * 
       * if at least one push message went through it is a success, otherwise it failed
       **/
      if (groomedResults.totalPush === groomedResults.totalFailedPush && groomedResults.totalPush !== 0) {
        logger.info(`[Push Notification service] - ${new Date().toString()} - Message from UID: ${senderUID} couldn't be delivered, reason: failed pushes`, groomedResults);
        return Promise.reject(new errors.GeneralError('FCM push server error - no push call have succedeed', groomedResults));
      } else if(groomedResults.totalPush === 0) {
        logger.info(`[Push Notification service] - ${new Date().toString()} - Message from UID: ${senderUID} couldn't be delivered, reason: no valid subscriptions`, groomedResults);
        return Promise.resolve('Moody\'s backend error - no valid push subscriptions found');
      } else {
        if (groomedResults.totalFailedPush === 0) {
          logger.info(`[Push Notification service] - ${new Date().toString()} - Message from UID: ${senderUID} delivered to all subscribed sources`, groomedResults);
        } else {
          logger.info(`[Push Notification service] - ${new Date().toString()} - Message from UID: ${senderUID} delivered to part of subscribed sources`, groomedResults);
        }
        return Promise.resolve(groomedResults);
      }
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
