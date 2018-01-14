const SubscriptionKeys = {
  $id: 'SubscriptionKeys',
  properties: {
    auth: { type: 'string' },
    p256dh: { type: 'string' }
  },
  required: ['auth', 'p256dh']
};

module.exports = SubscriptionKeys;