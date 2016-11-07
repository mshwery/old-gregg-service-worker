'use strict';

function createNotification(event) {
  console.log('Handling message event: ', event);

  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  var title = event.data.title;
  var body = event.data.body;
  var icon = event.data.icon;

  self.registration.showNotification(title, {
    body: body,
    icon: icon
  });
}

self.addEventListener('message', createNotification);

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    var client = clientList.filter(function(client) {
      return client.url === '/' && 'focus' in client;
    });

    if (client[0]) {
      return client[0].focus();
    }

    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));
});