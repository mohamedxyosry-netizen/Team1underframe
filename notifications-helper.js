// ============================================================
// NERIC - Notifications Helper
// ============================================================

(function () {
    "use strict";

    const SUPABASE_FUNCTION_URL = "https://gzyybadyaunizdlvmcle.supabase.co/functions/v1/notify";
    const SUPABASE_ANON_KEY = "sb_publishable_zg4OnUfu83dzvD_GOIgarA__gbaXCEO";

    const ADMIN_USERNAME = "Yosry";

    // ============================================================
    // الدالة الأساسية
    // ============================================================
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

            // تحديد الصفحة اللي هتفتح لما المستخدم يدوس على الإشعار
let targetPage = "index.html"; // الافتراضي
if (data && data.type) {
    if (data.type === "leave_request") targetPage = "leaves-admin.html";
    else if (data.type === "leave_approved" || data.type === "leave_rejected") targetPage = "leaves.html";
    else if (data.type === "chat_message") targetPage = "chat.html";
    else if (data.type === "priority_item") targetPage = "priority.html";
}

// إضافة رابط الصفحة للبيانات اللي هتتبعت
payload.data.url = "/Team1underframe/" + targetPage;

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

    // ============================================================
    // 🔔 الدوال الجاهزة
    // ============================================================

    // 1) إشعار للمدير بس
    function sendAdminOnly(title, body, data) {
        return sendPush(title, body, data, [ADMIN_USERNAME]);
    }

    // 2) إشعار للمدير + كل الفنيين
    function sendEveryone(title, body, data) {
        return sendPush(title, body, data, null);
    }

    // ============================================================
    // كشف الدوال
    // ============================================================
    window.NERIC_Notify = {
        sendAdminOnly: sendAdminOnly,
        sendEveryone: sendEveryone,
        sendPush: sendPush
    };

    console.log("[NERIC-Notify] Helper loaded ✅");
})();