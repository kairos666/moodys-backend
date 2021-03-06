const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const authentication = require('./authentication');
const swagger = require('feathers-swagger'); 

const app = feathers();

/**
 * Apply CORS rules
 * dev whitelist is large
 * prod whitelist is narrow
 */
const corsWhitelist = configuration()().cors.whitelist;
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // self origin
      callback(null, true);
    } else if (corsWhitelist.indexOf(origin) !== -1 || corsWhitelist.indexOf('*') !== -1) {
      // whitelisted origin
      callback(null, true);
    } else {
      // reject in all other cases
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors(corsOptions));
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());

// Set up swagger UI docs
app.configure(swagger({ 
  swagger: '2.0',
  docsPath: '/docs', 
  uiIndex: path.join(__dirname, 'docs.html'), 
  info: { 
    title: 'moody\'s backend - push notification service', 
    description: 'backend service for handling push notifications for moody\'s PWA application' 
  },
  schemes: ['https'],
  definitions: {
    Notif: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'notification title', example: 'my notif title' },
        options: { $ref: '#/definitions/NotifOptions', type: 'object' }
      },
      required: ['title']
    },
    NotifOptions: {
      type: 'object',
      properties: {
        badge: { type: 'string', format: 'uri-template', description: 'notification OS icon (e.g. mobile marker)', example: 'static/notification-badge.png' },
        icon: { type: 'string', format: 'uri-template', description: 'notification icon (part of notification content)', example: 'static/notification-icon.png' },
        body: { type: 'string', description: 'notification body copy (part of notification content)', example: 'my notif content text' },
        tag: { type: 'string', description: 'notification tag, allow specific behaviors (ex: merging of related notifications)', example: 'test-notif' },
        data: { type: 'object', description: 'additional custom information to be passed along with the notification' }
      }
    }
  },
  securityDefinitions: {
    ApiKeyAuth:{
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header'
    }
  },
  security: [
    {
      ApiKeyAuth: []
    }
  ]
})); 

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// authentication
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);

// remove unnecessary swagger docs
const hiddenDocs = app.get('swagger').hiddenDocs;
hiddenDocs.forEach(service => {
  // hide endpoints
  service.endpoints.forEach(endPoint => {
    if (app.docs.paths[endPoint]) delete app.docs.paths[endPoint];
  });
  
  // hide service (if all endpoints are ignored, hide the collapse menu entirely)
  if (service.fullServiceHidden) {
    app.docs.tags = app.docs.tags.filter(tag => (service.serviceName !== tag.name));
  }
});

// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.hooks(appHooks);

module.exports = app;
