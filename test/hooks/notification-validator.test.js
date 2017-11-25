const assert = require('assert');
const notificationValidator = require('../../src/hooks/notification-validator');

describe('\'notification-validator\' hook', () => {
  // data generator
  function* bodyData() {
    let index = 0;
    // test data
    let data = [
      { 
        test: {
          title: 'valid Notif without options',
          isValid: true
        }, 
        requestBody: { 
          title: 'xxx'
        }
      },
      { 
        test: {
          title: 'valid Notif with empty options',
          isValid: true
        }, 
        requestBody: { 
          title: 'xxx',
          options: {}
        }
      },
      { 
        test: {
          title: 'valid Notif with options',
          isValid: true
        }, 
        requestBody: { 
          title: 'xxx',
          options: {
            badge: './images/pouet.png',
            icon: '../images/pouet.png',
            body: 'pouet',
            tag: 'pouet'
          }
        }
      },
      { 
        test: {
          title: 'invalid Notif without options',
          isValid: false
        }, 
        requestBody: { 
          title: 666
        }
      },
      { 
        test: {
          title: 'Notif with invalid options type',
          isValid: false
        }, 
        requestBody: { 
          title: 'xxx',
          options: 666
        }
      },
      { 
        test: {
          title: 'Notif with invalid options A',
          isValid: false
        }, 
        requestBody: { 
          title: 'xxx',
          options: {
            badge: './images/pouet.png',
            icon: '../images/pouet.png',
            body: 'pouet',
            tag: 666
          }
        }
      },
      { 
        test: {
          title: 'Notif with invalid options B',
          isValid: false
        }, 
        requestBody: { 
          title: 'xxx',
          options: {
            badge: './images  !!!!  pouet.png',
            icon: '../images/pouet.png',
            body: 'pouet',
            tag: 'pouet'
          }
        }
      }
    ];
  
    while(index < data.length) {
      let testData = data[index];
      index++;
      yield testData;
    }
  }

  // test cb builder
  let itCbBuilder = function(premock, test) {
    const mock = { data: premock };

    return () => {
      // Initialize our hook with no options
      const hook = notificationValidator();

      // Run the hook function (which returns a promise)
      // and compare the resulting hook object
      return hook(mock).then(result => {
        assert.equal(test.isValid, true, 'hook should reject/fail');
        assert.equal(result, mock, 'Returns the expected hook object');
      }).catch(error => {
        assert.equal(test.isValid, false, 'hook should resolve/succeed');
        assert.equal(error.name, 'NotAcceptable', 'Returns the expected error type');
        assert.equal(error.message, 'data not valid - Notif Schema', 'Returns the expected error message');
      });
    };
  };

  // init first test
  const dataGen = bodyData();
  let testIteration = dataGen.next();

  // run various tests in sequence
  while(!testIteration.done) {
    it(`runs the hook - ${testIteration.value.test.title}`, itCbBuilder(
      Object.assign({}, testIteration.value.requestBody),
      Object.assign({}, testIteration.value.test)
    ));

    // setup for next test
    testIteration = dataGen.next();
  }
});
