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
  console.log('[SW] Background message:', payload);

  const data = payload.data || {};

  const notificationTitle = data.title || 'NERIC';
  const notificationBody = data.body || 'لديك إشعار جديد';

  const notificationOptions = {
    body: notificationBody,
    // 🚂 صورة القطر في الإشعار
    icon: 'https://img.icons8.com/fluency/192/train.png',
    // 🚂 صورة القطر الصغيرة في شريط الحالة
    badge: 'https://img.icons8.com/fluency/96/train.png',
    data: data
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

let targetPath = (event.notification.data && event.notification.data.url) || "/Team1underframe/index.html";

// التأكد من وجود السلاش في البداية
if (!targetPath.startsWith("/")) {
    targetPath = "/" + targetPath;
}

const targetUrl = new URL(targetPath, self.location.origin).href;
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