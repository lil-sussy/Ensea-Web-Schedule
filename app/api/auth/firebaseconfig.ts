import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // New import

// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAH1WvRPNDwIOwuS7fRodexNiJW6k-uvPs",
	authDomain: "ensea-web-schedule.firebaseapp.com",
	projectId: "ensea-web-schedule",
	storageBucket: "ensea-web-schedule.appspot.com",
	messagingSenderId: "199059616108",
	appId: "1:199059616108:web:02eab45e13ac597e638349",
	measurementId: "G-DFMX68CNV4",
};

export const firebase = initializeApp(firebaseConfig);
export const database = getFirestore(firebase);
export const auth = getAuth(firebase);
// export const analytics = getAnalytics(fireBase);

/* eslint-disable no-undef */
// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-analytics.js');

// // Initialize Firebase
// console.log('navigator.cookieEnabled: ' + navigator.cookieEnabled);
// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();
// // eslint-disable-next-line no-restricted-globals
// self.addEventListener('notificationclick', function(event) {
// 	console.log("antes de cerrar");
//   event.notification.close();
//   console.log("después de cerrar");
//   event.waitUntil(
//     clients.openWindow(event.notification.data.url)
//   );

// }
// , false);

// // background (Web app is closed or not in browser focus) then you should
// // implement this optional method.
// // [START background_handler]
// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
// 	console.log("antes de mostrar");
//   const notification = payload.notification ? payload.notification : payload.data.message ? JSON.parse(payload.data.message).notification : payload.data.payload ? JSON.parse(payload.data.payload).notification : JSON.parse(payload);
//   const notificationTitle = notification.title || 'Background Message Title';
//   const notificationOptions = {
//     body: notification.body || 'Background Message body.',
//     icon: '/new-logo192.png',
//     data: { url: notification.url }
//   };

//   // eslint-disable-next-line no-restricted-globals
//   return self.registration.showNotification(notificationTitle,
//       notificationOptions);
// });
