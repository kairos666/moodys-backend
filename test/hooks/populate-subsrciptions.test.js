const assert = require('assert');
const populateSubsrciptions = require('../../src/hooks/populate-subsrciptions');

const testSubscriptionsArray = ['sub1', 'sub2', 'sub3'];
const testNotification = {
  title: 'pouet',
  body: 'pouet'
};
const baseMock = {
  method: 'create',
  type: 'before',
  app: {
    service: function() {
      return {
        find: function() {
          return Promise.resolve(testSubscriptionsArray);
        }
      };
    }
  },
  data: testNotification
};

describe('\'populate-subsrciptions\' hook', () => {
  it('runs the hook - stringify notification data, add subscriptions array', () => {
    // A mock hook object
    const mock = Object.assign({}, baseMock);
    // Initialize our hook with no options
    const hook = populateSubsrciptions();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result.data.subscriptions, testSubscriptionsArray, 'add subscriptions array to data');
      assert.equal(result.data.notification, JSON.stringify(testNotification), 'keep notification data JSON string');
    });
  });
});
