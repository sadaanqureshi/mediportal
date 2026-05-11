// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// YAHAN APNI ASAL KEYS PASTE KARNA (Baghair NEXT_PUBLIC_ ke)
firebase.initializeApp({
  apiKey: "AIzaSyB_FQpu0SSBXnmKckA8Gd7RO4CqTo_-gV8",
  authDomain: "ehad-fyp.firebaseapp.com",
  projectId: "ehad-fyp",
  storageBucket: "ehad-fyp.firebasestorage.app",
  messagingSenderId: "106151657765",
  appId: "1:106151657765:web:89ffdd7d5d84cb3d7ddacc"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new update.',
    icon: '/favicon.ico' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});