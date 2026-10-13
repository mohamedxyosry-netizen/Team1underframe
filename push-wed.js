// NERIC Web Push - Firebase Messaging
 // Firebase SDK 10.14.1

(function () {
    if (window.NERIC_webPush) return;

    const VAPID_KEY =
        "BO-AU7YMB-1zXaq6buM4Qw-f23AaGPyjQekt4EGst3Jt97l7Eah9OnB6-AeMLVCQopFb4Rg1XBXYzOijSS92A1s";

    const firebaseConfig = {
        apiKey: "AIzaSyBRKF7KP2ptXhkURT7KmPPvY3GCK_lqJzI",
        authDomain: "neric-735ce.firebaseapp.com",
        projectId: "neric-735ce",
        storageBucket: "neric-735ce.firebasestorage.app",
        messagingSenderId: "310465215862",
        appId: "1:310465215862:web:5ebd799d4dde0f79b2ce57",
        measurementId: "G-EE965421EJ"
    };

    window.NERIC_webPush = {
        initialized: false,

        init: function () {
            if (!window.firebase ||
                !firebase.messaging) {
                console.error(
                    "NERIC Web Push: Firebase SDK missing"
                );
                return false;
            }

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.initialized = true;
            console.log(
                "NERIC Web Push: Firebase initialized"
            );

            return true;
        },

        enable: async function () {
            if (!this.init()) {
                throw new Error("Firebase غير جاهز");
            }

            if (!("Notification" in window)) {
                throw new Error(
                    "المتصفح لا يدعم الإشعارات"
                );
            }

            if (!("serviceWorker" in navigator)) {
                throw new Error(
                    "Service Worker غير مدعوم"
                );
            }

            if (!window.isSecureContext) {
                throw new Error(
                    "الموقع يحتاج اتصال HTTPS"
                );
            }

            const permission =
                await Notification.requestPermission();

            if (permission !== "granted") {
                throw new Error(
                    "لم يتم السماح بالإشعارات"
                );
            }

            const registration =
                await navigator.serviceWorker.register(
                    "/Team1underframe/firebase-messaging-sw.js",
                    { scope: "/Team1underframe/" }
                );

            await navigator.serviceWorker.ready;

            const messaging = firebase.messaging();

            const token = await messaging.getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (!token) {
                throw new Error(
                    "لم يتم الحصول على FCM Token"
                );
            }

            console.log(
                "NERIC Web Push: FCM Token received"
            );

            return token;
        }
    };

    window.NERIC_webPush.init();
})();