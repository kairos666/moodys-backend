

const notificationValidator = require('../../hooks/notification-validator');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ notificationValidator() ],
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
