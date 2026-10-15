// ============================================================
// NERIC Web Push - Firebase Messaging (Browser Version)
// Firebase SDK 10.14.1
// ============================================================

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

    // ---------- عرض إشعار للتاب المفتوح ----------
    async function showForegroundNotification(payload) {
        try {
            const data = payload.data || {};
            const notificationTitle = data.title || "NERIC";
            const notificationBody = data.body || "لديك إشعار جديد";

            if (!("Notification" in window)) return;
            if (Notification.permission !== "granted") return;

            const registration = await navigator.serviceWorker.ready;

            await registration.showNotification(notificationTitle, {
                body: notificationBody,
                icon: "./favicon.ico",
                badge: "./favicon.ico",
                data: data
            });

            console.log("[NERIC-WebPush] 🔔 Foreground notification shown");
        } catch (error) {
            console.error("[NERIC-WebPush] Foreground notification error:", error);
        }
    }

    // ---------- قراءة المستخدم الحالي ----------
    function getCurrentUsername() {
        try {
            if (typeof window.getCurrentUser === "function") {
                const u = window.getCurrentUser();
                if (u && u.username) return u.username;
            }

            const raw = sessionStorage.getItem("currentUser");
            if (!raw) return null;

            const obj = JSON.parse(raw);
            return obj && obj.username ? obj.username : null;
        } catch (e) {
            return null;
        }
    }

    // ---------- حفظ التوكن في Supabase ----------
    async function saveTokenToSupabase(token, username) {
        if (!window.supabaseClient) {
            console.warn("[NERIC-WebPush] Supabase غير متاح");
            return false;
        }

        if (!token || !username) {
            console.warn("[NERIC-WebPush] Token أو Username ناقص");
            return false;
        }

        try {
            const { error } = await window.supabaseClient
                .from("user_devices")
                .upsert(
                    {
                        username: username,
                        fcm_token: token,
                        platform: "web",
                        active: true,
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: "fcm_token" }
                );

            if (error) {
                console.error("[NERIC-WebPush] خطأ الحفظ:", error);
                return false;
            }

            console.log("✅ [NERIC-WebPush] تم حفظ التوكن للمستخدم:", username);
            return true;
        } catch (e) {
            console.error("[NERIC-WebPush] استثناء:", e);
            return false;
        }
    }

    window.NERIC_webPush = {
        initialized: false,
        foregroundSetup: false,

        // ---------- تهيئة Firebase ----------
        init: function () {
            if (!window.firebase || !firebase.messaging) {
                console.error("[NERIC-WebPush] Firebase SDK غير موجود");
                return false;
            }

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.initialized = true;
            console.log("[NERIC-WebPush] Firebase initialized");
            return true;
        },

        // ---------- إعداد استقبال الإشعارات في المقدمة ----------
        setupForegroundListener: function () {
            if (this.foregroundSetup) return;
            if (!this.init()) return;

            try {
                const messaging = firebase.messaging();

                messaging.onMessage(function (payload) {
                    console.log("[NERIC-WebPush] 📩 Foreground message:", payload);
                    showForegroundNotification(payload);
                });

                this.foregroundSetup = true;
                console.log("[NERIC-WebPush] ✅ Foreground listener ready");
            } catch (e) {
                console.error("[NERIC-WebPush] Setup foreground error:", e);
            }
        },

        // ---------- طلب الإذن + الحصول على التوكن ----------
        enable: async function () {
            if (!this.init()) {
                throw new Error("Firebase غير جاهز");
            }

            if (!("Notification" in window)) {
                throw new Error("المتصفح لا يدعم الإشعارات");
            }

            if (!("serviceWorker" in navigator)) {
                throw new Error("Service Worker غير مدعوم");
            }

            if (!window.isSecureContext) {
                throw new Error("الموقع يحتاج اتصال HTTPS");
            }

            if (Notification.permission === "denied") {
                throw new Error(
                    "الإشعارات محظورة. لازم تفتح إعدادات المتصفح وتسمح بالإشعارات لهذا الموقع."
                );
            }

            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                throw new Error("لم يتم السماح بالإشعارات");
            }

            const registration = await navigator.serviceWorker.register(
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
                throw new Error("لم يتم الحصول على FCM Token");
            }

            console.log("[NERIC-WebPush] ✅ FCM Token received");

            // 🔑 فعّل الاستماع في المقدمة
            this.setupForegroundListener();

            return token;
        },

        // ---------- طلب الإذن + الحفظ في Supabase في خطوة واحدة ----------
        enableAndSave: async function () {
            try {
                const token = await this.enable();
                const username = getCurrentUsername();

                if (!username) {
                    console.warn("[NERIC-WebPush] مفيش مستخدم مسجل حالياً");
                    localStorage.setItem("neric_pending_web_token", token);
                    return { success: false, reason: "no_user" };
                }

                const saved = await saveTokenToSupabase(token, username);

                return { success: saved, token: token, username: username };
            } catch (error) {
                console.error("[NERIC-WebPush] فشل التفعيل:", error.message);
                return { success: false, reason: error.message };
            }
        },

        // ---------- حفظ التوكن المعلّق بعد تسجيل الدخول ----------
        flushPending: async function () {
            const pending = localStorage.getItem("neric_pending_web_token");
            if (!pending) return false;

            const username = getCurrentUsername();
            if (!username) return false;

            const ok = await saveTokenToSupabase(pending, username);

            if (ok) {
                localStorage.removeItem("neric_pending_web_token");
            }

            return ok;
        }
    };

    // ---------- تهيئة أولية ----------
    window.NERIC_webPush.init();

    // ---------- تفعيل foreground لو الإذن مسموح ----------
    if (typeof Notification !== "undefined" &&
        Notification.permission === "granted") {

        setTimeout(function () {
            try {
                window.NERIC_webPush.setupForegroundListener();
            } catch (e) {
                console.error("[NERIC-WebPush] Auto foreground setup error:", e);
            }
        }, 1500);
    }
})();