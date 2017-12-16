
const apiAuthenticate = require('../../hooks/api-authenticate');
const notificationValidator = require('../../hooks/notification-validator');

const populateSubsrciptions = require('../../hooks/populate-subsrciptions');

module.exports = {
  before: {
    all: [apiAuthenticate()],
    find: [],
    get: [],
    create: [ notificationValidator(), populateSubsrciptions() ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
