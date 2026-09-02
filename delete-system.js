// ============================================================
// NERIC - Delete System
// المدير يحذف مباشرة
// باقي المستخدمين يرسلون طلب حذف
// Wiring / LT / HT / Installation / Final
// Supabase Only
// ============================================================

(function () {

    "use strict";


    // ============================================================
    // SUPABASE
    // ============================================================

    const SUPABASE_URL =
        "https://gzyybadyaunizdlvmcle.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_zg4OnUfu83dzvD_GOIgarA__gbaXCEO";


    function getSupabase() {

        if (
            window.supabaseClient &&
            typeof window.supabaseClient.from === "function"
        ) {

            return window.supabaseClient;

        }


        if (
            window.supabase &&
            typeof window.supabase.createClient === "function"
        ) {

            try {

                const client =
                    window.supabase.createClient(
                        SUPABASE_URL,
                        SUPABASE_KEY
                    );


                window.supabaseClient =
                    client;


                return client;

            }

            catch (error) {

                console.error(
                    "NERIC: Supabase Client Error:",
                    error
                );

            }

        }


        return null;

    }



    // ============================================================
    // CURRENT USER
    // ============================================================

    function getCurrentUser() {

        try {

            const data =
                sessionStorage.getItem(
                    "currentUser"
                );


            if (!data) {

                return null;

            }


            return JSON.parse(data);

        }

        catch (error) {

            console.error(
                "NERIC: Current User Error:",
                error
            );


            return null;

        }

    }



    // ============================================================
    // TEXT
    // ============================================================

    function cleanText(value) {

        return String(
            value ?? ""
        ).trim();

    }



    // ============================================================
    // HTML ESCAPE
    // ============================================================

    function escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }



    // ============================================================
    // SECTION CONFIG
    // ============================================================

    const SECTION_CONFIG = {

        wiring: {
            container: "wiringRecords",
            title: "قسم Wiring"
        },

        lt: {
            container: "ltRecords",
            title: "قسم LT"
        },

        ht: {
            container: "htRecords",
            title: "قسم HT"
        },

        installation: {
            container: "installationRecords",
            title: "قسم التركيبات"
        },

        final: {
            container: "finalRecords",
            title: "قسم الفنش النهائي"
        }

    };



    // ============================================================
    // DEPARTMENT
    // ============================================================

    function getDepartmentFromStorage(
        storageName
    ) {

        const map = {

            wiring: "wiring",
            wiringRecords: "wiring",

            lt: "lt",
            ltRecords: "lt",

            ht: "ht",
            htRecords: "ht",

            installation: "installation",
            installationRecords: "installation",

            final: "final",
            finalRecords: "final"

        };


        return (
            map[storageName] ||
            ""
        );

    }



    // ============================================================
    // SECTION NAME
    // ============================================================

    function getSectionName(
        department
    ) {

        const names = {

            wiring: "قسم Wiring",

            lt: "قسم LT",

            ht: "قسم HT",

            installation: "قسم التركيبات",

            final: "قسم الفنش النهائي"

        };


        return (
            names[department] ||
            department ||
            "القسم"
        );

    }



    // ============================================================
    // ADMIN CHECK
    // ============================================================

    function isAdmin(user) {

        if (!user) {

            return false;

        }


        return (
            cleanText(user.role).toLowerCase()
            ===
            "admin"
        );

    }



    // ============================================================
    // FINAL PERMISSION
    // ============================================================

    function canOpenFinal(user) {

        if (!user) {

            return false;

        }


        if (isAdmin(user)) {

            return true;

        }


        const username =
            cleanText(
                user.username ||
                user.name
            );


        return (
            username === "Osama" ||
            username === "Mamdouh"
        );

    }



    // ============================================================
    // DELETE PERMISSION
    // ============================================================

    function canRequestDelete(
        department,
        user
    ) {

        if (!user) {

            return false;

        }


        // ========================================================
        // المدير يستطيع التعامل مع كل الأقسام
        // ========================================================

        if (isAdmin(user)) {

            return true;

        }


        // ========================================================
        // Final
        // ========================================================

        if (
            department === "final"
        ) {

            return canOpenFinal(user);

        }


        // ========================================================
        // العامل يستطيع طلب حذف قسمه فقط
        // ========================================================

        return (
            cleanText(user.role).toLowerCase()
            ===
            cleanText(department).toLowerCase()
        );

    }



    // ============================================================
    // RECORD ID
    // ============================================================

    function getRecordId(
        record
    ) {

        if (!record) {

            return "";

        }


        return String(
            record.id ??
            record.Id ??
            record.recordId ??
            ""
        );

    }



    // ============================================================
    // CAR NAME
    // ============================================================

    function getCarName(
        record
    ) {

        if (!record) {

            return "";

        }


        return cleanText(
            record.car_name ??
            record.Car_name ??
            record.carName ??
            ""
        );

    }



    // ============================================================
    // CAR NUMBER
    // ============================================================

    function getCarNumber(
        record
    ) {

        if (!record) {

            return "";

        }


        return cleanText(
            record.car_number ??
            record.Car_number ??
            record.carNumber ??
            ""
        );

    }



    // ============================================================
    // ADD CSS
    // ============================================================

    function addDeleteStyles() {

        if (
            document.getElementById(
                "neric-delete-system-style"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "neric-delete-system-style";


        style.textContent = `

            .neric-delete-wrapper {

                margin-top: 14px;

                padding-top: 12px;

                border-top: 1px dashed #d1d5db;

                display: flex;

                flex-direction: column;

                gap: 8px;

            }


            .neric-delete-button {

                width: 100%;

                border: none;

                background: #dc3545;

                color: white;

                padding: 11px 14px;

                border-radius: 10px;

                cursor: pointer;

                font-size: 14px;

                font-weight: bold;

                font-family: inherit;

            }


            .neric-delete-button:hover {

                opacity: .9;

            }


            .neric-delete-button:disabled {

                background: #6c757d;

                cursor: not-allowed;

                opacity: .8;

            }


            .neric-delete-status {

                width: 100%;

                padding: 11px 12px;

                border-radius: 10px;

                text-align: center;

                line-height: 1.7;

                font-size: 13px;

                font-weight: bold;

                box-sizing: border-box;

            }


            .neric-delete-pending {

                background: #fff3cd;

                border: 1px solid #ffe69c;

                color: #856404;

            }


            .neric-delete-rejected {

                background: #f8d7da;

                border: 1px solid #f1aeb5;

                color: #842029;

            }

        `;


        document.head.appendChild(
            style
        );

    }



    // ============================================================
    // GET PAGE RECORDS
    // ============================================================

    async function getDepartmentRecords(
        department
    ) {

        const supabase =
            getSupabase();


        if (!supabase) {

            return [];

        }


        try {

            const result =
                await supabase
                    .from("records")
                    .select("*")
                    .eq(
                        "department",
                        department
                    )
                    .order(
                        "id",
                        {
                            ascending: false
                        }
                    );


            if (result.error) {

                console.error(
                    "NERIC records error:",
                    result.error
                );


                return [];

            }


            return result.data || [];

        }

        catch (error) {

            console.error(
                "NERIC records exception:",
                error
            );


            return [];

        }

    }



    // ============================================================
    // GET DELETE REQUESTS
    // ============================================================

    async function getDeleteRequests(
        department
    ) {

        const supabase =
            getSupabase();


        if (!supabase) {

            return [];

        }


        try {

            const result =
                await supabase
                    .from("delete_requests")
                    .select("*")
                    .eq(
                        "section",
                        getSectionName(
                            department
                        )
                    )
                    .order(
                        "id",
                        {
                            ascending: false
                        }
                    );


            if (result.error) {

                console.error(
                    "NERIC delete_requests error:",
                    result.error
                );


                return [];

            }


            return result.data || [];

        }

        catch (error) {

            console.error(
                "NERIC delete_requests exception:",
                error
            );


            return [];

        }

    }



    // ============================================================
    // LATEST REQUEST FOR RECORD
    // ============================================================

    function getLatestRequestForRecord(
        requests,
        recordId
    ) {

        const id =
            String(recordId);


        for (
            let i = 0;
            i < requests.length;
            i++
        ) {

            if (
                String(
                    requests[i].record_id
                ) === id
            ) {

                return requests[i];

            }

        }


        return null;

    }



    // ============================================================
    // PENDING REQUEST
    // ============================================================

    function getPendingRequestForRecord(
        requests,
        recordId
    ) {

        const id =
            String(recordId);


        for (
            let i = 0;
            i < requests.length;
            i++
        ) {

            const request =
                requests[i];


            if (
                String(
                    request.record_id
                ) === id
                &&
                request.status === "pending"
            ) {

                return request;

            }

        }


        return null;

    }



    // ============================================================
    // DELETE DIRECTLY - ADMIN
    // ============================================================

    async function deleteRecordDirectly(
        recordId
    ) {

        const supabase =
            getSupabase();


        if (!supabase) {

            alert(
                "❌ Supabase غير متصل"
            );

            return false;

        }


        try {

            console.log(
                "👑 ADMIN DIRECT DELETE:",
                recordId
            );


            const result =
                await supabase
                    .from("records")
                    .delete()
                    .eq(
                        "id",
                        recordId
                    );


            if (result.error) {

                console.error(
                    "❌ ADMIN DELETE ERROR:",
                    result.error
                );


                alert(
                    "❌ فشل حذف البيانات\n\n" +
                    result.error.message
                );


                return false;

            }


            console.log(
                "✅ ADMIN DELETE SUCCESS:",
                recordId
            );


            return true;

        }

        catch (error) {

            console.error(
                "❌ ADMIN DELETE EXCEPTION:",
                error
            );


            alert(
                "❌ حدث خطأ أثناء حذف البيانات\n\n" +
                error.message
            );


            return false;

        }

    }



    // ============================================================
    // SEND DELETE REQUEST / ADMIN DIRECT DELETE
    // ============================================================

    async function requestDeleteRecordById(
        recordId,
        storageName,
        carName,
        carNumber
    ) {

        const user =
            getCurrentUser();


        // ========================================================
        // LOGIN
        // ========================================================

        if (!user) {

            alert(
                "يجب تسجيل الدخول أولًا ❌"
            );


            window.location.href =
                "login.html";


            return false;

        }


        // ========================================================
        // DEPARTMENT
        // ========================================================

        const department =
            getDepartmentFromStorage(
                storageName
            );


        // ========================================================
        // PERMISSION
        // ========================================================

        if (
            !canRequestDelete(
                department,
                user
            )
        ) {

            alert(
                "ليس لديك صلاحية حذف هذا البيان ❌"
            );


            return false;

        }


        // ========================================================
        // RECORD ID
        // ========================================================

        if (!recordId) {

            alert(
                "رقم البيان غير موجود ❌"
            );


            return false;

        }


        // ========================================================
        // ADMIN
        // ========================================================

        if (isAdmin(user)) {

            const deleted =
                await deleteRecordDirectly(
                    recordId
                );


            if (deleted) {

                // تحديث الصفحة مباشرة
                window.location.reload();

            }


            return deleted;

        }


        // ========================================================
        // SUPABASE
        // ========================================================

        const supabase =
            getSupabase();


        if (!supabase) {

            alert(
                "❌ Supabase غير متصل"
            );


            return false;

        }


        // ========================================================
        // CHECK EXISTING REQUESTS
        // ========================================================

        const requests =
            await getDeleteRequests(
                department
            );


        const pending =
            getPendingRequestForRecord(
                requests,
                recordId
            );


        if (pending) {

            alert(
                "⏳ يوجد بالفعل طلب حذف لهذا البيان.\n\nفي انتظار رد المدير."
            );


            return false;

        }


        // ========================================================
        // REASON
        // ========================================================

        const reason =
            window.prompt(
                "اكتب سبب طلب حذف هذا البيان:"
            );


        if (reason === null) {

            return false;

        }


        const cleanReason =
            cleanText(
                reason
            );


        if (!cleanReason) {

            alert(
                "يجب كتابة سبب طلب الحذف ❌"
            );


            return false;

        }


        // ========================================================
        // USER
        // ========================================================

        const requestedBy =
            cleanText(
                user.name ||
                user.username ||
                "Unknown"
            );


        const requestedByUsername =
            cleanText(
                user.username ||
                user.name ||
                "Unknown"
            );


        // ========================================================
        // REQUEST DATA
        // ========================================================

        const requestData = {

            record_id:
                String(recordId),

            storage_name:
                cleanText(
                    storageName
                ),

            car_name:
                cleanText(
                    carName
                ),

            car_number:
                cleanText(
                    carNumber
                ),

            section:
                getSectionName(
                    department
                ),

            requested_by:
                requestedBy,

            requested_by_username:
                requestedByUsername,

            reason:
                cleanReason,

            request_date:
                new Date().toISOString(),

            status:
                "pending"

        };


        console.log(
            "NERIC DELETE REQUEST:",
            requestData
        );


        // ========================================================
        // INSERT REQUEST
        // ========================================================

        try {

            const result =
                await supabase
                    .from("delete_requests")
                    .insert(
                        requestData
                    )
                    .select()
                    .single();


            if (result.error) {

                console.error(
                    "NERIC DELETE INSERT ERROR:",
                    result.error
                );


                alert(
                    "❌ فشل إرسال طلب الحذف\n\n" +
                    result.error.message
                );


                return false;

            }


            alert(
                "✅ تم إرسال طلب الحذف إلى المدير\n\n⏳ في انتظار الموافقة."
            );


            await refreshCurrentSection();


            return true;

        }

        catch (error) {

            console.error(
                "NERIC DELETE REQUEST ERROR:",
                error
            );


            alert(
                "❌ حدث خطأ أثناء إرسال طلب الحذف"
            );


            return false;

        }

    }



    // ============================================================
    // OLD COMPATIBILITY FUNCTION
    // ============================================================

    async function requestDeleteRecord(
        storageName,
        index
    ) {

        const department =
            getDepartmentFromStorage(
                storageName
            );


        const records =
            await getDepartmentRecords(
                department
            );


        if (
            index < 0 ||
            index >= records.length
        ) {

            alert(
                "البيان غير موجود ❌"
            );


            return false;

        }


        const record =
            records[index];


        return await requestDeleteRecordById(

            getRecordId(record),

            storageName,

            getCarName(record),

            getCarNumber(record)

        );

    }



    // ============================================================
    // ADD DELETE BUTTON
    // ============================================================

    function renderDeleteControl(
        element,
        storageName,
        record,
        latestRequest
    ) {

        if (
            !element ||
            !record
        ) {

            return;

        }


        // ========================================================
        // REMOVE OLD CONTROL
        // ========================================================

        const old =
            element.querySelector(
                ".neric-delete-wrapper"
            );


        if (old) {

            old.remove();

        }


        // ========================================================
        // CURRENT USER
        // ========================================================

        const user =
            getCurrentUser();


        if (!user) {

            return;

        }


        // ========================================================
        // DEPARTMENT
        // ========================================================

        const department =
            getDepartmentFromStorage(
                storageName
            );


        // ========================================================
        // PERMISSION
        // ========================================================

        if (
            !canRequestDelete(
                department,
                user
            )
        ) {

            return;

        }


        // ========================================================
        // RECORD ID
        // ========================================================

        const recordId =
            getRecordId(record);


        if (!recordId) {

            return;

        }


        // ========================================================
        // WRAPPER
        // ========================================================

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "neric-delete-wrapper";


        // ========================================================
        // CREATE BUTTON
        // ========================================================

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "neric-delete-button";


        // ========================================================
        // ADMIN BUTTON
        // ========================================================

        if (isAdmin(user)) {

            button.textContent =
                "🗑️ حذف البيانات";


            button.title =
                "حذف مباشر بواسطة المدير";


            button.addEventListener(
                "click",
                async function () {

                    button.disabled =
                        true;


                    button.textContent =
                        "⏳ جاري الحذف...";


                    const deleted =
                        await requestDeleteRecordById(

                            recordId,

                            storageName,

                            getCarName(record),

                            getCarNumber(record)

                        );


                    if (!deleted) {

                        button.disabled =
                            false;


                        button.textContent =
                            "🗑️ حذف البيانات";

                    }

                }
            );


            wrapper.appendChild(
                button
            );


            element.appendChild(
                wrapper
            );


            // مهم:
            // المدير لا يدخل في حالات pending/rejected/approved
            return;

        }


        // ========================================================
        // PENDING - NORMAL USERS
        // ========================================================

        if (
            latestRequest &&
            latestRequest.status === "pending"
        ) {

            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "neric-delete-status neric-delete-pending";


            status.textContent =
                "⏳ في انتظار رد المدير";


            wrapper.appendChild(
                status
            );


            element.appendChild(
                wrapper
            );


            return;

        }


        // ========================================================
        // REJECTED - NORMAL USERS
        // ========================================================

        if (
            latestRequest &&
            latestRequest.status === "rejected"
        ) {

            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "neric-delete-status neric-delete-rejected";


            const rejectionReason =
                cleanText(
                    latestRequest.rejection_reason
                );


            if (rejectionReason) {

                status.innerHTML =
                    "❌ تم رفض طلب الحذف" +
                    "<br>" +
                    "<span>" +
                    escapeHTML(
                        rejectionReason
                    ) +
                    "</span>";

            }

            else {

                status.textContent =
                    "❌ تم رفض طلب الحذف";

            }


            wrapper.appendChild(
                status
            );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "neric-delete-button";


            button.textContent =
                "🗑️ طلب حذف البيانات مرة أخرى";


            button.addEventListener(
                "click",
                async function () {

                    button.disabled =
                        true;


                    await requestDeleteRecordById(

                        recordId,

                        storageName,

                        getCarName(record),

                        getCarNumber(record)

                    );


                    button.disabled =
                        false;

                }
            );


            wrapper.appendChild(
                button
            );


            element.appendChild(
                wrapper
            );


            return;

        }


        // ========================================================
        // APPROVED
        // ========================================================

        if (
            latestRequest &&
            latestRequest.status === "approved"
        ) {

            return;

        }


        // ========================================================
        // NORMAL USER DELETE BUTTON
        // ========================================================

        button.textContent =
            "🗑️ طلب حذف البيانات";


        button.addEventListener(
            "click",
            async function () {

                button.disabled =
                    true;


                await requestDeleteRecordById(

                    recordId,

                    storageName,

                    getCarName(record),

                    getCarNumber(record)

                );


                button.disabled =
                    false;

            }
        );


        wrapper.appendChild(
            button
        );


        element.appendChild(
            wrapper
        );

    }



    // ============================================================
    // REFRESH CURRENT SECTION
    // ============================================================

    async function refreshCurrentSection() {

        const user =
            getCurrentUser();


        if (!user) {

            return;

        }


        const containers = [

            "wiringRecords",

            "ltRecords",

            "htRecords",

            "installationRecords",

            "finalRecords"

        ];


        let foundContainer =
            null;


        let storageName =
            "";


        // ========================================================
        // FIND CURRENT PAGE
        // ========================================================

        for (
            let i = 0;
            i < containers.length;
            i++
        ) {

            const container =
                document.getElementById(
                    containers[i]
                );


            if (container) {

                foundContainer =
                    container;


                storageName =
                    containers[i];


                break;

            }

        }


        if (!foundContainer) {

            return;

        }


        const department =
            getDepartmentFromStorage(
                storageName
            );


        if (
            !canRequestDelete(
                department,
                user
            )
        ) {

            return;

        }


        // ========================================================
        // GET RECORDS
        // ========================================================

        const records =
            await getDepartmentRecords(
                department
            );


        // ========================================================
        // GET REQUESTS
        // ========================================================

        let requests = [];


        // المدير مش محتاج طلبات الحذف
        if (!isAdmin(user)) {

            requests =
                await getDeleteRequests(
                    department
                );

        }


        // ========================================================
        // PAGE ELEMENTS
        // ========================================================

        const elements =
            foundContainer.querySelectorAll(
                ".record"
            );


        // ========================================================
        // LOOP
        // ========================================================

        for (
            let i = 0;
            i < elements.length;
            i++
        ) {

            const element =
                elements[i];


            let record =
                null;


            // ====================================================
            // TRY RECORD ID
            // ====================================================

            const elementId =
                element.dataset
                    ? element.dataset.recordId
                    : "";


            if (elementId) {

                record =
                    records.find(
                        function(item) {

                            return (
                                String(
                                    getRecordId(item)
                                ) ===
                                String(
                                    elementId
                                )
                            );

                        }
                    );

            }


            // ====================================================
            // FALLBACK
            // ====================================================

            if (!record) {

                record =
                    records[i];

            }


            if (!record) {

                continue;

            }


            // ====================================================
            // SAVE ID
            // ====================================================

            element.dataset.recordId =
                getRecordId(record);


            // ====================================================
            // LATEST REQUEST
            // ====================================================

            const latestRequest =
                isAdmin(user)
                    ? null
                    : getLatestRequestForRecord(
                        requests,
                        getRecordId(record)
                    );


            // ====================================================
            // RENDER DELETE
            // ====================================================

            renderDeleteControl(

                element,

                storageName,

                record,

                latestRequest

            );

        }

    }



    // ============================================================
    // OBSERVE RECORD CONTAINER
    // ============================================================

    function observeCurrentContainer() {

        const containers = [

            "wiringRecords",

            "ltRecords",

            "htRecords",

            "installationRecords",

            "finalRecords"

        ];


        let container =
            null;


        for (
            let i = 0;
            i < containers.length;
            i++
        ) {

            const element =
                document.getElementById(
                    containers[i]
                );


            if (element) {

                container =
                    element;


                break;

            }

        }


        if (!container) {

            return;

        }


        let timer =
            null;


        const observer =
            new MutationObserver(
                function() {

                    clearTimeout(
                        timer
                    );


                    timer =
                        setTimeout(
                            function() {

                                refreshCurrentSection();

                            },
                            500
                        );

                }
            );


        observer.observe(
            container,
            {
                childList: true,
                subtree: true
            }
        );

    }



    // ============================================================
    // INITIALIZE
    // ============================================================

    function initializeDeleteSystem() {

        addDeleteStyles();


        setTimeout(
            function() {

                refreshCurrentSection();

            },
            1000
        );


        observeCurrentContainer();

    }



    // ============================================================
    // EXPORT
    // ============================================================

    window.requestDeleteRecordById =
        requestDeleteRecordById;


    window.requestDeleteRecord =
        requestDeleteRecord;


    window.refreshDeleteButtons =
        refreshCurrentSection;


    window.canRequestDelete =
        canRequestDelete;



    // ============================================================
    // START
    // ============================================================

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeDeleteSystem
        );

    }

    else {

        initializeDeleteSystem();

    }

})();