// ============================================================
// NERIC - Notifications Helper
// ============================================================

(function () {
    "use strict";

    const SUPABASE_FUNCTION_URL = "https://gzyybadyaunizdlvmcle.supabase.co/functions/v1/send-push-v2";
    const SUPABASE_ANON_KEY = "sb_publishable_zg4OnUfu83dzvD_GOIgarA__gbaXCEO";

    const ADMIN_USERNAME = "Yosry";

    async function sendPush(title, body, data, targetUsernames) {
        try {
            const payload = {
                title: title,
                body: body,
                data: data || {}
            };

            if (Array.isArray(targetUsernames) && targetUsernames.length > 0) {
                payload.target_usernames = targetUsernames;
            }

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