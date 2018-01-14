const assert = require('assert');
const app = require('../../src/app');

describe('\'push-notification\' service', () => {
  it('registered the service', () => {
    const service = app.service('push-notification');

    assert.ok(service, 'Registered the service');
  });
});
