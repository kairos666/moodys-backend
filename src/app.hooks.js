// Application hooks that run for every service
const logger = require('./hooks/logger');
const apiAuthenticate = require('./hooks/api-authenticate');
const errorHandler = require('./hooks/error-handler');

module.exports = {
  before: {
    all: [ apiAuthenticate() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ errorHandler() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
