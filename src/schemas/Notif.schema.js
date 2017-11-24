const Notif = {
  $id: 'Notif',
  properties: {
    title: { type: 'string' },
    options: { $ref: 'NotifOptions', type: 'object' }
  },
  required: ['title']
}

module.exports = Notif;
