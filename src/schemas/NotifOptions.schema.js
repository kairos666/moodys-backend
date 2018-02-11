const NotifOptions = {
  $id: 'NotifOptions',
  properties: {
    badge: { type: 'string', format: 'uri-template' },
    icon: { type: 'string', format: 'uri-template' },
    body: { type: 'string' },
    tag: { type: 'string' },
    data: { type: 'object' }
  }
};

module.exports = NotifOptions;
