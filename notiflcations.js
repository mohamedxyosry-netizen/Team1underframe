// ===============================
// نظام إشعارات المدير
// ===============================

(function () {
    "use strict";

    // نتأكد إن المستخدم الحالي هو المدير فقط
    function isAdmin() {
        try {
            const user = JSON.parse(sessionStorage.getItem("currentUser"));
            return user && user.role === "admin";
        } catch (error) {
            return false;
        }
    }

    // لو مش المدير، ما نعملش أي حاجة
    if (!isAdmin()) {
        return;
    }

    let notifications = [];

    // ===============================
    // إنشاء شكل الجرس
    // ===============================
    function createNotificationUI() {

        if (document.getElementById("notificationSystem")) {
            return;
        }

        const container = document.createElement("div");
        container.id = "notificationSystem";

        container.innerHTML = `
            <button id="notificationBell" title="الإشعارات">
                🔔
                <span id="notificationCount">0</span>
            </button>

            <div id="notificationPanel">

                <div class="notification-header">
                    <strong>الإشعارات</strong>

                    <button id="markAllNotifications">
                        تحديد الكل كمقروء
                    </button>
                </div>

                <div id="notificationList">
                    <div class="notification-empty">
                        لا توجد إشعارات
                    </div>
                </div>

            </div>
        `;

        document.body.appendChild(container);

        addNotificationStyles();

        document
            .getElementById("notificationBell")
            .addEventListener("click", toggleNotificationPanel);

        document
            .getElementById("markAllNotifications")
            .addEventListener("click", markAllAsRead);
    }


    // ===============================
    // CSS
    // ===============================
    function addNotificationStyles() {

        if (document.getElementById("notificationStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "notificationStyles";

        style.textContent = `

            #notificationSystem {
                position: fixed;
                left: 20px;
                top: 20px;
                z-index: 99999;
                direction: rtl;
            }

            #notificationBell {
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 50%;
                background: white;
                box-shadow: 0 3px 15px rgba(0,0,0,.25);
                font-size: 25px;
                cursor: pointer;
                position: relative;
            }

            #notificationBell:hover {
                transform: scale(1.05);
            }

            #notificationCount {
                position: absolute;
                top: -5px;
                right: -5px;

                min-width: 20px;
                height: 20px;

                padding: 2px 5px;

                background: red;
                color: white;

                border-radius: 20px;

                font-size: 12px;
                font-weight: bold;

                display: none;
                align-items: center;
                justify-content: center;
            }

            #notificationPanel {
                display: none;

                position: absolute;
                left: 0;
                top: 60px;

                width: 350px;
                max-height: 500px;

                background: white;
                border-radius: 15px;

                box-shadow: 0 8px 30px rgba(0,0,0,.25);

                overflow: hidden;
            }

            .notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;

                padding: 15px;

                border-bottom: 1px solid #eee;
            }

            .notification-header strong {
                font-size: 18px;
            }

            #markAllNotifications {
                border: none;
                background: transparent;
                cursor: pointer;
                font-size: 12px;
                color: #555;
            }

            #notificationList {
                max-height: 430px;
                overflow-y: auto;
            }

            .notification-item {
                padding: 14px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: .2s;
            }

            .notification-item:hover {
                background: #f5f5f5;
            }

            .notification-item.unread {
                background: #eef6ff;
                border-right: 4px solid #1976d2;
            }

            .notification-title {
                font-weight: bold;
                font-size: 15px;
                margin-bottom: 7px;
            }

            .notification-message {
                font-size: 13px;
                line-height: 1.7;
                color: #444;
            }

            .notification-date {
                font-size: 11px;
                color: #888;
                margin-top: 7px;
            }

            .notification-empty {
                padding: 30px 15px;
                text-align: center;
                color: #888;
            }

            @media (max-width: 600px) {

                #notificationSystem {
                    left: 10px;
                    top: 10px;
                }

                #notificationPanel {
                    width: calc(100vw - 20px);
                    max-width: 350px;
                }

            }

        `;

        document.head.appendChild(style);
    }


    // ===============================
    // فتح وإغلاق الإشعارات
    // ===============================
    function toggleNotificationPanel() {

        const panel = document.getElementById("notificationPanel");

        if (!panel) return;

        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }


    // ===============================
    // تحميل الإشعارات
    // ===============================
    async function loadNotifications() {

        if (!window.supabaseClient) {
            console.error("Supabase client غير موجود");
            return;
        }

        const { data, error } = await window.supabaseClient
            .from("notifications")
            .select("*")
            .eq("target_role", "admin")
            .order("created_at", {
                ascending: false
            });

        if (error) {

            console.error(
                "خطأ في تحميل الإشعارات:",
                error
            );

            return;
        }

        notifications = data || [];

        renderNotifications();
    }


    // ===============================
    // عرض الإشعارات
    // ===============================
    function renderNotifications() {

        const list = document.getElementById("notificationList");
        const count = document.getElementById("notificationCount");

        if (!list || !count) {
            return;
        }

        const unread = notifications.filter(
            notification => !notification.is_read
        ).length;


        // عدد الإشعارات غير المقروءة
        if (unread > 0) {

            count.textContent =
                unread > 99 ? "99+" : unread;

            count.style.display = "flex";

        } else {

            count.style.display = "none";
        }


        // لا توجد إشعارات
        if (notifications.length === 0) {

            list.innerHTML = `
                <div class="notification-empty">
                    لا توجد إشعارات
                </div>
            `;

            return;
        }


        // عرض الإشعارات
        list.innerHTML = notifications
            .map(notification => {

                const date = new Date(
                    notification.created_at
                );

                const formattedDate =
                    date.toLocaleString("ar-EG");


                return `

                    <div
                        class="notification-item ${
                            notification.is_read
                                ? ""
                                : "unread"
                        }"
                        data-id="${notification.id}"
                    >

                        <div class="notification-title">
                            ${escapeHTML(
                                notification.title || "إشعار جديد"
                            )}
                        </div>

                        <div class="notification-message">
                            ${escapeHTML(
                                notification.message || ""
                            )}
                        </div>

                        <div class="notification-date">
                            ${formattedDate}
                        </div>

                    </div>

                `;

            })
            .join("");


        // الضغط على إشعار
        list
            .querySelectorAll(".notification-item")
            .forEach(item => {

                item.addEventListener(
                    "click",
                    async function () {

                        const id =
                            this.dataset.id;

                        await markAsRead(id);

                    }
                );

            });
    }


    // ===============================
    // تحديد إشعار كمقروء
    // ===============================
    async function markAsRead(id) {

        const { error } =
            await window.supabaseClient
                .from("notifications")
                .update({
                    is_read: true
                })
                .eq("id", id);

        if (error) {

            console.error(
                "خطأ في تحديث الإشعار:",
                error
            );

            return;
        }

        const notification =
            notifications.find(
                item => String(item.id) === String(id)
            );

        if (notification) {
            notification.is_read = true;
        }

        renderNotifications();
    }


    // ===============================
    // تحديد الكل كمقروء
    // ===============================
    async function markAllAsRead() {

        const { error } =
            await window.supabaseClient
                .from("notifications")
                .update({
                    is_read: true
                })
                .eq("target_role", "admin")
                .eq("is_read", false);

        if (error) {

            console.error(
                "خطأ في تحديد الإشعارات:",
                error
            );

            return;
        }

        notifications.forEach(
            notification => {
                notification.is_read = true;
            }
        );

        renderNotifications();
    }


    // ===============================
    // حماية النصوص
    // ===============================
    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ===============================
    // استقبال إشعار جديد مباشرة
    // ===============================
    function subscribeToNotifications() {

        if (!window.supabaseClient) {
            return;
        }

        window.supabaseClient
            .channel("admin-notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: "target_role=eq.admin"
                },
                payload => {

                    const newNotification =
                        payload.new;

                    notifications.unshift(
                        newNotification
                    );

                    renderNotifications();

                    showBrowserNotification(
                        newNotification
                    );
                }
            )
            .subscribe();
    }


    // ===============================
    // إشعار المتصفح
    // ===============================
    function showBrowserNotification(notification) {

        if (
            typeof Notification === "undefined"
        ) {
            return;
        }

        if (
            Notification.permission !== "granted"
        ) {
            return;
        }

        new Notification(
            notification.title || "إشعار جديد",
            {
                body:
                    notification.message || "",
                icon: "favicon.ico"
            }
        );
    }


    // ===============================
    // زر تجربة إشعارات المتصفح
    // ===============================
    window.enableBrowserNotifications =
        async function () {

            if (
                typeof Notification === "undefined"
            ) {

                alert(
                    "المتصفح لا يدعم الإشعارات"
                );

                return;
            }

            const permission =
                await Notification.requestPermission();

            if (permission === "granted") {

                alert(
                    "تم تفعيل إشعارات المتصفح بنجاح ✅"
                );

            } else {

                alert(
                    "لم يتم السماح بالإشعارات"
                );
            }
        };


    // ===============================
    // تشغيل النظام
    // ===============================
    function initializeNotifications() {

        createNotificationUI();

        loadNotifications();

        subscribeToNotifications();
    }


    // ننتظر تحميل الصفحة
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeNotifications
        );

    } else {

        initializeNotifications();
    }

})();