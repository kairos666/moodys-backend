// Initializes the `subscriptions` service on path `/subscriptions`
const createService = require('./subscriptions.class.js');
const hooks = require('./subscriptions.hooks');
const filters = require('./subscriptions.filters');
const firebase = require('firebase');
const logger = require('winston');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const firebaseConfig = app.get('firebase');

  // initialize firebase app
  const firebaseApp = firebase.initializeApp(firebaseConfig.firebaseAppConfig);
  // get DB instance
  const firebaseAppDB = firebase.database(firebaseApp);
  const pGetAllSubscriptions = function() {
    return new Promise((resolve, reject) => {
      firebaseAppDB.ref('notifsSubscriptionEntries').once('value', snapshot => {
        resolve(snapshot.val());
      }, error => {
        reject(error);
      });
    });
  };
  // authenticate (user account with access rights for all users registered subscriptions)
  const firebaseAuth = firebase.auth(firebaseApp);
  firebaseAuth.signInWithEmailAndPassword(firebaseConfig.firebaseSubscriptionsAuth.email, firebaseConfig.firebaseSubscriptionsAuth.password).catch(err => {
    logger.error(`couldn't authenticate with firebase - ${err.message}`);
  });

  const options = {
    name: 'subscriptions',
    paginate,
    pGetAllSubscriptions
  };

  // Initialize our service with any options it requires
  app.use('/subscriptions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('subscriptions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
