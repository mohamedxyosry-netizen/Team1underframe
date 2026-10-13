importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBRKF7KP2ptXhkURT7KmPPvY3GCK_lqJzI",
  authDomain: "neric-735ce.firebaseapp.com",
  projectId: "neric-735ce",
  storageBucket: "neric-735ce.firebasestorage.app",
  messagingSenderId: "310465215862",
  appId: "1:310465215862:web:5ebd799d4dde0f79b2ce57",
  measurementId: "G-EE965421EJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || 'NERIC';

  const notificationOptions = {
    body: payload.notification?.body || 'لديك إشعار جديد',
    icon: './favicon.ico',
    data: payload.data || {}
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data.url || './login.html',
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin) &&
            'focus' in client) {
          return client.focus().then(() => {
            if ('navigate' in client) {
              return client.navigate(targetUrl);
            }
          });
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});