/**
 * Check out https://googlechrome.github.io/sw-toolbox/docs/master/index.html for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */

'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// dynamically cache assets
self.toolbox.router.get('/assets/*', self.toolbox.fastest);

// for any other requests go to the network
self.toolbox.router.default = self.toolbox.networkOnly;

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  if (event.data) {
    var data = event.data.json();
    event.waitUntil(
      Promise.all([
        self.registration.showNotification('Message from CigarScanner', {
          body: data.message,
          data: data,
          icon: 'assets/images/notification-icon.png'
        }),
        self.clients.matchAll().then(function(clients) {
          clients.forEach(function(client) {
            client.postMessage({
              command: 'pushNotificationRecieved',
              data: data
            });
          })
        })
      ])
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  var url = 'https://www.cigarscanner.com/#/';
  var fromNotification = '?fromNotification=true';
  var data = event.notification.data;

  if (data.RedirectUrl) {
    url = data.RedirectUrl;
  }
  else if (data.Social && data.Social.Action == 'Follow') {
     url += 'social/user-profile/users/' + data.Social.UserId;

  } else if (data.Social && data.Social.SocialPostId) {
    url += 'social/post/' + data.Social.SocialPostId + fromNotification;

  } else if (data.ProductId) {
    url += 'cigar/P-' + data.ProductId + fromNotification;

  } else if (data.LineId) {
    url += 'cigar/L-' + data.LineId + fromNotification;

  } else {
    url += 'notifications/';
  }

  event.notification.close();
  return clients.openWindow(url);
});
