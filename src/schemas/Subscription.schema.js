const Subscription = {
  $id: 'Subscription',
  properties: {
    endpoint: { type: 'string', format: 'url' },
    keys: { $ref: 'SubscriptionKeys', type: 'object' }
  },
  required: ['endpoint', 'keys']
};

module.exports = Subscription;