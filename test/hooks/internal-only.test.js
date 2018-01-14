const assert = require('assert');
const internalOnly = require('../../src/hooks/internal-only');

const baseMock = {
  method: 'create',
  type: 'before',
  params: {}
};

describe('\'internal-only\' hook', () => {
  it('hook - provider server', () => {
    // A mock hook object
    let mock = Object.assign({}, baseMock);
    // Initialize our hook with no options
    const hook = internalOnly();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });

  it('hook - provider external', () => {
    // A mock hook object
    let mock = Object.assign({}, baseMock);
    mock.params.provider = 'external';
    // Initialize our hook with no options
    const hook = internalOnly();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).catch(error => {
      assert.equal(error.name, 'Forbidden', 'Returns the expected error type');
      assert.equal(error.message, 'external call - forbidden', 'Returns the expected error message');
    });
  });
});
