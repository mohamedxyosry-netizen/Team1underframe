// ============================================================
// NERIC - Notifications Helper
// ============================================================

(function () {
    "use strict";

    const SUPABASE_FUNCTION_URL = "https://gzyybadyaunizdlvmcle.supabase.co/functions/v1/notify";
    const SUPABASE_ANON_KEY = "sb_publishable_zg4OnUfu83dzvD_GOIgarA__gbaXCEO";

    const ADMIN_USERNAME = "Yosry";

// قائمة الكلمات المحجوزة في Firebase FCM
const RESERVED_KEYS = [
    "from",
    "message_type",
    "collapse_key",
    "google",
    "gcm",
    "google.c.a.e",
    "google.c.c.a.e"
];

function sanitizeData(data) {
    const clean = {};

    if (!data || typeof data !== "object") {
        return clean;
    }

    Object.keys(data).forEach(function (key) {
        const lowerKey = String(key).toLowerCase();

        // نتجاهل الكلمات المحجوزة
        if (RESERVED_KEYS.indexOf(lowerKey) !== -1) {
            console.warn(
                "[NERIC-Notify] تم تجاهل key محجوز:",
                key
            );
            return;
        }

        clean[key] = String(data[key]);
    });

    return clean;
}

async function sendPush(title, body, data, targetUsernames) {
    try {
        const payload = {
            title: title,
            body: body,
            data: sanitizeData(data)
        };
            const response = await fetch(SUPABASE_FUNCTION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + SUPABASE_ANON_KEY
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log("[NERIC-Notify] Sent:", title, "→", result);
            return result;
        } catch (error) {
            console.error("[NERIC-Notify] Error:", error);
            return null;
        }
    }

    function sendAdminOnly(title, body, data) {
        return sendPush(title, body, data, [ADMIN_USERNAME]);
    }

    function sendEveryone(title, body, data) {
        return sendPush(title, body, data, null);
    }

    window.NERIC_Notify = {
        sendAdminOnly: sendAdminOnly,
        sendEveryone: sendEveryone,
        sendPush: sendPush
    };

    console.log("[NERIC-Notify] Helper loaded ✅");
})();