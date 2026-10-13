// ============================================================
// NERIC — Push Notifications (Firebase Cloud Messaging)
// ملف مستقل تمامًا — لا يعدل أي وظيفة موجودة
// ============================================================

(function () {
  "use strict";

  const PENDING_KEY = "neric_pending_fcm_token";
  const LOG = (...a) => console.log("[NERIC-Push]", ...a);

  // البلجن متاح فقط جوة التطبيق الأصلي (Capacitor Native)
  const Push = (window.Capacitor && window.Capacitor.Plugins)
    ? window.Capacitor.Plugins.PushNotifications
    : null;

  // ---------- حفظ التوكن في Supabase ----------
  async function saveTokenToSupabase(fcmToken, username) {
    if (!window.supabaseClient) {
      LOG("Supabase غير متاح");
      return false;
    }

    try {
      const { error } = await window.supabaseClient
        .from("user_devices")
        .upsert(
          {
            username: username,
            fcm_token: fcmToken,
            platform: "android",
            active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "fcm_token" }
        );

      if (error) {
        console.error("[NERIC-Push] خطأ في الحفظ:", error);
        return false;
      }

      LOG("✅ تم حفظ التوكن للمستخدم:", username);
      return true;
    } catch (e) {
      console.error("[NERIC-Push] استثناء:", e);
      return false;
    }
  }

  // ---------- قراءة المستخدم الحالي ----------
  function getUsername() {
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

  // ---------- استلام التوكن الجديد ----------
  async function handleNewToken(fcmToken) {
    LOG("📱 تم استلام FCM Token");
    const username = getUsername();

    if (!username) {
      localStorage.setItem(PENDING_KEY, fcmToken);
      LOG("⏳ تم تخزين التوكن مؤقتًا (بانتظار تسجيل الدخول)");
      return;
    }

    await saveTokenToSupabase(fcmToken, username);
    localStorage.removeItem(PENDING_KEY);
  }

  // ---------- إرسال التوكن المعلق بعد تسجيل الدخول ----------
  async function flushPendingToken() {
    const pending = localStorage.getItem(PENDING_KEY);
    if (!pending) return;

    const username = getUsername();
    if (!username) return;

    LOG("📤 إرسال التوكن المعلق للمستخدم:", username);
    const ok = await saveTokenToSupabase(pending, username);
    if (ok) localStorage.removeItem(PENDING_KEY);
  }

  // ---------- التعامل مع ضغط الإشعار ----------
  function handleNotificationTap(data) {
    if (!data) return;

    const target = data.target || data.target_page || "";
    const source = data.source || "";
    const sourceId = data.source_id || "";

    LOG("👆 تم الضغط على الإشعار:", { target, source, sourceId });

    if (target === "chat" || source === "chat") {
      let url = "chat.html";
      if (sourceId) url += "?id=" + encodeURIComponent(sourceId);
      window.location.href = url;
      return;
    }

    if (target === "notifications") {
      window.location.href = "notifications.html";
      return;
    }

    window.location.href = "index.html";
  }

  // ---------- تسجيل الجهاز ----------
  async function registerDevice() {
    if (!Push) {
      LOG("ℹ️ البلجن غير متاح (لسنا داخل التطبيق الأصلي)");
      return;
    }

    try {
      let perm = await Push.checkPermissions();
      LOG("حالة الإذن الحالية:", perm.receive);

      if (perm.receive === "prompt" ||
          perm.receive === "prompt-with-rationale") {
        perm = await Push.requestPermissions();
        LOG("بعد طلب الإذن:", perm.receive);
      }

      if (perm.receive !== "granted") {
        LOG("⚠️ لم يتم منح الإذن — لن تصل الإشعارات");
        return;
      }

      // المستمعون (لازم قبل register)
      await Push.addListener("registration", (token) => {
        handleNewToken(token.value);
      });

      await Push.addListener("registrationError", (err) => {
        console.error("[NERIC-Push] ❌ فشل التسجيل:", err);
      });

      await Push.addListener("pushNotificationReceived", (notification) => {
        LOG("🔔 إشعار وصل (التطبيق مفتوح):", notification);
      });

      await Push.addListener("pushNotificationActionPerformed", (action) => {
        LOG("👆 تم الضغط:", action);
        handleNotificationTap(
          action.notification && action.notification.data
        );
      });

      await Push.register();
      LOG("✅ تم إرسال طلب التسجيل لـ FCM");

    } catch (e) {
      console.error("[NERIC-Push] استثناء أثناء التسجيل:", e);
    }
  }

  // ---------- تهيئة ----------
  function init() {
    registerDevice().then(() => {
      flushPendingToken();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // نكشف الدوال للاستخدام من login.html
  window.NERIC_push = {
    flushPendingToken: flushPendingToken,
    registerDevice: registerDevice,
  };

})();