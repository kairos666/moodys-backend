const assert = require('assert');
const apiAuthenticate = require('../../src/hooks/api-authenticate');
const app = require('../../src/app');
const apiKeyData = app.get('authentication').apiKey;

const baseMock = {
  method: 'create',
  type: 'before',
  app: app
};

describe('\'apiAuthenticate\' hook', () => {
  it('runs the hook (external provider, valid api key header)', () => {
    // A mock hook object
    const mock = Object.assign({}, baseMock, {
      params: {
        provider: 'external',
        headers: {}
      }
    });
    mock.params.headers[apiKeyData.header] = apiKeyData.allowedKeys[0];

    // Initialize our hook with no options
    const hook = apiAuthenticate();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs the hook (internal provider, no api key header)', () => {
    // A mock hook object
    const mock = baseMock;
    // Initialize our hook with no options
    const hook = apiAuthenticate();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('runs the hook (external provider, invalid api key header)', () => {
    // A mock hook object
    const mock = Object.assign({}, baseMock, {
      params: {
        provider: 'external',
        headers: {}
      }
    });
    mock.params.headers[apiKeyData.header] = 'wrongkey';

    // Initialize our hook with no options
    const hook = apiAuthenticate();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).catch(error => {
      assert.equal(error.name, 'Forbidden', 'Returns the expected error type');
      assert.equal(error.message, `no valid api key found in header - ${apiKeyData.header}`, 'Returns the expected error message');
    });
  });

  it('runs the hook (external provider, no api key header)', () => {
    // A mock hook object
    const mock = Object.assign({}, baseMock, {
      params: {
        provider: 'external',
        headers: {}
      }
    });

    // Initialize our hook with no options
    const hook = apiAuthenticate();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).catch(error => {
      assert.equal(error.name, 'Forbidden', 'Returns the expected error type');
      assert.equal(error.message, `no authorization header found - ${apiKeyData.header}`);
    });
  });
});
