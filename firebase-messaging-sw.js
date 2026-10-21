// vibe. push notifications (Firebase Cloud Messaging). Registered by vibe.html.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAZn-MWlArpHYcb7Z88u-wzKdrBxtIsYiE",
  authDomain: "tracker-9a8cb.firebaseapp.com",
  projectId: "tracker-9a8cb",
  storageBucket: "tracker-9a8cb.firebasestorage.app",
  messagingSenderId: "765187139896",
  appId: "1:765187139896:web:61ddd4fad7ee85364239cd"
});
// pushes sent by scripts/vibe-push.mjs carry a notification block, so FCM shows them itself
firebase.messaging();

// clicks on notifications vibe.html shows itself (FCM handles clicks on its own ones first)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = data.link || '/vibe.html';
  event.waitUntil(clients.matchAll({ type:'window', includeUncontrolled:true }).then(list => {
    const win = list.find(c => new URL(c.url).pathname.startsWith('/vibe'));
    if (win) { win.postMessage({ type:'vibe-open-checkin', vaId:data.vaId, n:data.n }); return win.focus(); }
    return clients.openWindow(url);
  }));
});
