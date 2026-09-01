// ============================================================
// نظام إدارة بيانات العمل
// الحسابات + الصلاحيات + الأقسام + السجلات
// + البحث + طلبات حذف بموافقة المدير
// ============================================================


// ============================================================
// الحسابات
// ============================================================

const users = {

    // =========================
    // المدير
    // =========================

    Yosry: {
        password: "0111252",
        role: "admin",
        name: "Yosry"
    },


    // =========================
    // Wiring
    // =========================

    Zezo: {
        password: "58321476",
        role: "wiring",
        name: "Zezo"
    },

    Abdo: {
        password: "74185296",
        role: "wiring",
        name: "Abdo"
    },


    // =========================
    // LT
    // =========================

    Osama: {
        password: "29481736",
        role: "lt",
        name: "Osama"
    },

    Yaser: {
        password: "63825194",
        role: "lt",
        name: "Yaser"
    },

    Seif: {
        password: "81573924",
        role: "lt",
        name: "Seif"
    },

    "Ahmed Ayman": {
        password: "47291638",
        role: "lt",
        name: "Ahmed Ayman"
    },


    // =========================
    // HT
    // =========================

    Mamdouh: {
        password: "92638471",
        role: "ht",
        name: "Mamdouh"
    },

    Ali: {
        password: "35182749",
        role: "ht",
        name: "Ali"
    },


    // =========================
    // التركيبات
    // =========================

    Eid: {
        password: "68421937",
        role: "installation",
        name: "Eid"
    },

    Mosad: {
        password: "51963827",
        role: "installation",
        name: "Mosad"
    },

    "Mohamed Haitham": {
        password: "83746192",
        role: "installation",
        name: "Mohamed Haitham"
    }

};


// ============================================================
// الصلاحيات
// ============================================================

const permissions = {

    // =========================
    // المدير
    // =========================

    admin: [
        "index.html",
        "wiring.html",
        "lt.html",
        "ht.html",
        "installation.html",
        "final.html",
        "search.html",
        "deleterequests.html",
        "chat.html"
    ],


    // =========================
    // Wiring
    // =========================

    wiring: [
        "index.html",
        "wiring.html",
        "chat.html"
    ],


    // =========================
    // LT
    // =========================

    lt: [
        "index.html",
        "lt.html",
        "chat.html"
    ],


    // =========================
    // HT
    // =========================

    ht: [
        "index.html",
        "ht.html",
        "chat.html"
    ],


    // =========================
    // التركيبات
    // =========================

    installation: [
        "index.html",
        "installation.html",
        "chat.html"
    ],


    // =========================
    // Final
    // =========================

    final: [
        "index.html",
        "final.html",
        "chat.html"
    ]

};

// ============================================================
// اسم تخزين طلبات الحذف
// ============================================================

const DELETE_REQUESTS_STORAGE =
    "deleteRequests";


// ============================================================
// الحصول على المستخدم الحالي
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

    } catch (error) {

        return null;

    }

}


// ============================================================
// الحصول على الصفحة الحالية
// ============================================================

function getCurrentPage() {

    let page =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (!page) {

        page =
            "index.html";

    }


    return page;

}


// ============================================================
// Final
// ============================================================

function canOpenFinal(user) {

    if (!user) {
        return false;
    }


    if (user.role === "admin") {
        return true;
    }


    if (user.username === "Osama") {
        return true;
    }


    if (user.username === "Mamdouh") {
        return true;
    }


    return false;

}


// ============================================================
// الصفحة الرئيسية
// ============================================================

function getHomePage() {

    return "index.html";

}


// ============================================================
// تسجيل الدخول
// ============================================================

function login() {

    const usernameInput =
        document.getElementById(
            "username"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );

    const message =
        document.getElementById(
            "message"
        );


    if (
        !usernameInput ||
        !passwordInput
    ) {

        return;

    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value.trim();


    if (
        !username ||
        !password
    ) {

        if (message) {

            message.innerText =
                "من فضلك اكتب اسم المستخدم وكلمة السر";

        }

        return;

    }


    const userData =
        users[username];


    if (
        !userData ||
        userData.password !== password
    ) {

        if (message) {

            message.innerText =
                "اسم المستخدم أو كلمة السر غير صحيحة ❌";

        }

        return;

    }


    const currentUser = {

        username: username,

        role: userData.role,

        name: userData.name

    };


    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    window.location.href =
        "index.html";

}


// ============================================================
// تسجيل الخروج
// ============================================================

function logout() {

    sessionStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}


// ============================================================
// العودة للرئيسية
// ============================================================

function goHome() {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    window.location.href =
        "index.html";

}


// ============================================================
// حماية الصفحات
// ============================================================

function protectPage() {

    const currentPage =
        getCurrentPage();


    if (
        currentPage === "login.html"
    ) {

        return;

    }


    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    if (
        user.role === "admin"
    ) {

        return;

    }


    if (
        currentPage === "index.html"
    ) {

        return;

    }


    if (
        currentPage === "final.html"
    ) {

        if (canOpenFinal(user)) {

            return;

        }


        alert(
            "ليس لديك صلاحية للدخول إلى الفنش النهائي ❌"
        );


        window.location.href =
            "index.html";

        return;

    }


    const allowedPages =
        permissions[user.role] || [];


    if (
        !allowedPages.includes(
            currentPage
        )
    ) {

        alert(
            "ليس لديك صلاحية للدخول إلى هذه الصفحة ❌"
        );


        window.location.href =
            "index.html";

        return;

    }

}


// ============================================================
// فتح الأقسام
// ============================================================

function openSection(section) {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    // ========================================================
    // المدير
    // ========================================================

    if (
        user.role === "admin"
    ) {

        if (section === "wiring") {

            window.location.href =
                "wiring.html";

        }

        else if (section === "lt") {

            window.location.href =
                "lt.html";

        }

        else if (section === "ht") {

            window.location.href =
                "ht.html";

        }

        else if (
            section === "installation"
        ) {

            window.location.href =
                "installation.html";

        }

        else if (
            section === "final"
        ) {

            window.location.href =
                "final.html";

        }

        else if (
            section === "search"
        ) {

            window.location.href =
                "search.html";

        }

        else if (
            section === "deleteRequests"
        ) {

            window.location.href =
                "deleteRequests.html";

        }

        return;

    }


    // ========================================================
    // طلبات الحذف - المدير فقط
    // ========================================================

    if (
        section === "deleteRequests"
    ) {

        alert(
            "طلبات الحذف متاحة للمدير فقط ❌"
        );

        return;

    }


    // ========================================================
    // البحث - المدير فقط
    // ========================================================

    if (
        section === "search"
    ) {

        alert(
            "ليس لديك صلاحية للدخول إلى سجل البيانات ❌"
        );

        return;

    }


    // ========================================================
    // Final
    // ========================================================

    if (
        section === "final"
    ) {

        if (canOpenFinal(user)) {

            window.location.href =
                "final.html";

            return;

        }


        alert(
            "ليس لديك صلاحية للدخول إلى الفنش النهائي ❌"
        );

        return;

    }


    // ========================================================
    // القسم الخاص بالمستخدم
    // ========================================================

    if (
        user.role !== section
    ) {

        alert(
            "ليس لديك صلاحية للدخول إلى هذا القسم ❌"
        );

        return;

    }


    if (
        section === "wiring"
    ) {

        window.location.href =
            "wiring.html";

    }

    else if (
        section === "lt"
    ) {

        window.location.href =
            "lt.html";

    }

    else if (
        section === "ht"
    ) {

        window.location.href =
            "ht.html";

    }

    else if (
        section === "installation"
    ) {

        window.location.href =
            "installation.html";

    }

}


// ============================================================
// تجهيز الصفحة الرئيسية
// ============================================================

function setupDashboard() {

    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    // ========================================================
    // اسم المستخدم
    // ========================================================

    const nameElement =
        document.getElementById(
            "currentUserName"
        );


    if (nameElement) {

        nameElement.innerText =
            user.name;

    }


    // ========================================================
    // نوع الحساب
    // ========================================================

    const roleElement =
        document.getElementById(
            "currentUserRole"
        );


    if (roleElement) {

        if (
            user.role === "admin"
        ) {

            roleElement.innerText =
                "Admin";

        }

        else if (
            user.role === "wiring"
        ) {

            roleElement.innerText =
                "Wiring";

        }

        else if (
            user.role === "lt"
        ) {

            roleElement.innerText =
                "LT";

        }

        else if (
            user.role === "ht"
        ) {

            roleElement.innerText =
                "HT";

        }

        else if (
            user.role === "installation"
        ) {

            roleElement.innerText =
                "Installation";

        }

        else {

            roleElement.innerText =
                "Worker";

        }

    }


    // ========================================================
    // مهم جدًا:
    // كل الأقسام تظل ظاهرة لكل المستخدمين
    // لكن openSection() هو المسؤول عن منع الدخول
    // ========================================================

    const sectionCards =
        document.querySelectorAll(
            ".section-card"
        );


    sectionCards.forEach(
        function(card) {

            card.style.display =
                "";

        }
    );


    // ========================================================
    // سجل البيانات
    // المدير فقط
    // ========================================================

    const searchButton =
        document.querySelector(
            'button[onclick="openSection(\'search\')"]'
        );


    if (searchButton) {

        searchButton.style.display =
            user.role === "admin"
                ? ""
                : "none";

    }


    // ========================================================
    // طلبات الحذف
    // المدير فقط
    // ========================================================

    const deleteRequestsMenu =
        document.getElementById(
            "deleteRequestsMenu"
        );


    if (deleteRequestsMenu) {

        deleteRequestsMenu.style.display =
            user.role === "admin"
                ? ""
                : "none";

    }


    // ========================================================
    // التقارير والإعدادات
    // المدير فقط
    // ========================================================

    const menuItems =
        document.querySelectorAll(
            ".sidebar-menu .menu-item"
        );


    menuItems.forEach(
        function(item) {

            const text =
                item.innerText.trim();


            if (
                user.role !== "admin" &&
                (
                    text.includes("التقارير") ||
                    text.includes("الإعدادات")
                )
            ) {

                item.style.display =
                    "none";

            }

        }
    );


    updateDeleteRequestsCount();

}


// ============================================================
// التاريخ والوقت
// ============================================================

function getCurrentDateTime() {

    const now =
        new Date();


    return now.toLocaleString(
        "ar-EG",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit",

            hour12: true

        }
    );

}


// ============================================================
// قراءة طلبات الحذف
// ============================================================

function getDeleteRequests() {

    try {

        const requests =
            JSON.parse(
                localStorage.getItem(
                    DELETE_REQUESTS_STORAGE
                ) || "[]"
            );


        if (
            Array.isArray(requests)
        ) {

            return requests;

        }

    } catch (error) {}

    return [];

}


// ============================================================
// حفظ طلبات الحذف
// ============================================================

function saveDeleteRequests(requests) {

    localStorage.setItem(
        DELETE_REQUESTS_STORAGE,
        JSON.stringify(requests)
    );

}


// ============================================================
// عدد طلبات الحذف المعلقة
// ============================================================

function getPendingDeleteRequestsCount() {

    const requests =
        getDeleteRequests();


    return requests.filter(
        function(request) {

            return request.status === "pending";

        }
    ).length;

}


// ============================================================
// تحديث رقم طلبات الحذف
// ============================================================

function updateDeleteRequestsCount() {

    const counter =
        document.getElementById(
            "deleteRequestsCount"
        );


    if (!counter) {
        return;
    }


    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        counter.style.display =
            "none";

        return;

    }


    const count =
        getPendingDeleteRequestsCount();


    counter.innerText =
        count;


    counter.style.display =
        count > 0
            ? "inline-block"
            : "none";

}


// ============================================================
// طلب حذف بيان
// ============================================================

function requestDeleteRecord(
    storageName,
    index
) {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    // المدير يستطيع الحذف مباشرة
    if (
        user.role === "admin"
    ) {

        deleteRecordDirectly(
            storageName,
            index
        );

        return;

    }


    // التأكد أن القسم يخص المستخدم
    const ownStorage = {

        wiring:
            "wiringRecords",

        lt:
            "ltRecords",

        ht:
            "htRecords",

        installation:
            "installationRecords"

    };


    let allowed =
        ownStorage[user.role] ===
        storageName;


    // Final
    if (
        storageName === "finalRecords" &&
        canOpenFinal(user)
    ) {

        allowed = true;

    }


    if (!allowed) {

        alert(
            "ليس لديك صلاحية طلب حذف هذا البيان ❌"
        );

        return;

    }


    const records =
        getRecordsFromStorage(
            storageName
        );


    if (
        index < 0 ||
        index >= records.length
    ) {

        alert(
            "البيان غير موجود ❌"
        );

        return;

    }


    const record =
        records[index];


    const requests =
        getDeleteRequests();


    const alreadyPending =
        requests.some(
            function(request) {

                return (
                    request.status === "pending" &&
                    request.storageName === storageName &&
                    request.recordId === record.recordId
                );

            }
        );


    if (alreadyPending) {

        alert(
            "تم إرسال طلب حذف هذا البيان بالفعل، وهو في انتظار موافقة المدير ⏳"
        );

        return;

    }


    const reason =
        prompt(
            "اكتب سبب طلب حذف هذا البيان:"
        );


    if (
        reason === null
    ) {

        return;

    }


    const cleanReason =
        reason.trim();


    if (!cleanReason) {

        alert(
            "يجب كتابة سبب طلب الحذف ❌"
        );

        return;

    }


    if (!record.recordId) {

        record.recordId =
            generateRecordId();

        records[index] =
            record;

        saveRecordsToStorage(
            storageName,
            records
        );

    }


    const deleteRequest = {

        id:
            generateRequestId(),

        storageName:
            storageName,

        recordId:
            record.recordId,

        recordIndex:
            index,

        carName:
            record.carName || "",

        carNumber:
            record.carNumber || "",

        section:
            getSectionName(
                storageName
            ),

        requestedBy:
            user.name,

        requestedByUsername:
            user.username,

        reason:
            cleanReason,

        requestDate:
            getCurrentDateTime(),

        status:
            "pending"

    };


    requests.push(
        deleteRequest
    );


    saveDeleteRequests(
        requests
    );


    alert(
        "تم إرسال طلب الحذف إلى المدير ✅\n\nلن يتم حذف البيان إلا بعد موافقة المدير."
    );


    updateDeleteRequestsCount();

    displayAllRecords();

}


// ============================================================
// حذف مباشر للمدير
// ============================================================

function deleteRecordDirectly(
    storageName,
    index
) {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        alert(
            "الحذف المباشر متاح للمدير فقط ❌"
        );

        return;

    }


    const confirmed =
        confirm(
            "⚠️ هل أنت متأكد أنك تريد حذف هذا البيان؟\n\nسيتم حذفه مباشرة."
        );


    if (!confirmed) {
        return;
    }


    const records =
        getRecordsFromStorage(
            storageName
        );


    if (
        index < 0 ||
        index >= records.length
    ) {

        alert(
            "البيان غير موجود ❌"
        );

        return;

    }


    records.splice(
        index,
        1
    );


    saveRecordsToStorage(
        storageName,
        records
    );


    alert(
        "تم حذف البيان بنجاح ✅"
    );


    displayAllRecords();

}


// ============================================================
// الدالة القديمة deleteRecord
// ============================================================

function deleteRecord(
    storageName,
    index
) {

    requestDeleteRecord(
        storageName,
        index
    );

}


// ============================================================
// الحصول على السجلات
// ============================================================

function getRecordsFromStorage(
    storageName
) {

    try {

        const records =
            JSON.parse(
                localStorage.getItem(
                    storageName
                ) || "[]"
            );


        if (
            Array.isArray(records)
        ) {

            return records;

        }

    } catch (error) {}

    return [];

}


// ============================================================
// حفظ السجلات
// ============================================================

function saveRecordsToStorage(
    storageName,
    records
) {

    localStorage.setItem(
        storageName,
        JSON.stringify(records)
    );

}


// ============================================================
// إنشاء ID
// ============================================================

function generateRecordId() {

    return (
        "record_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


function generateRequestId() {

    return (
        "request_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


// ============================================================
// اسم القسم
// ============================================================

function getSectionName(
    storageName
) {

    const names = {

        wiringRecords:
            "قسم Wiring",

        ltRecords:
            "قسم LT",

        htRecords:
            "قسم HT",

        installationRecords:
            "قسم التركيبات",

        finalRecords:
            "قسم الفنش النهائي"

    };


    return (
        names[storageName] ||
        storageName
    );

}


// ============================================================
// صفحة طلبات الحذف
// ============================================================

function displayDeleteRequests() {

    const container =
        document.getElementById(
            "deleteRequests"
        );


    if (!container) {
        return;
    }


    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        container.innerHTML = `

            <div class="error">

                ❌ هذه الصفحة متاحة للمدير فقط

            </div>

        `;

        return;

    }


    const requests =
        getDeleteRequests();


    container.innerHTML = "";


    if (
        requests.length === 0
    ) {

        container.innerHTML = `

            <div class="department-result no-data">

                <h2>
                    🗑️ طلبات الحذف
                </h2>

                <div class="no-car">

                    لا توجد طلبات حذف حاليًا

                </div>

            </div>

        `;

        updateDeleteRequestsCount();

        return;

    }


    const sortedRequests =
        [...requests].reverse();


    sortedRequests.forEach(
        function(request) {

            const realIndex =
                requests.findIndex(
                    function(item) {

                        return item.id === request.id;

                    }
                );


            let buttons = "";


            if (
                request.status === "pending"
            ) {

                buttons = `

                    <div style="
                        display:flex;
                        gap:10px;
                        margin-top:20px;
                        flex-wrap:wrap;
                    ">

                        <button
                            type="button"
                            onclick="approveDeleteRequest(${realIndex})"
                            style="
                                flex:1;
                                min-width:140px;
                                padding:12px;
                                border:none;
                                border-radius:8px;
                                background:#198754;
                                color:white;
                                font-size:15px;
                                font-weight:bold;
                                cursor:pointer;
                            "
                        >
                            ✅ موافقة على الحذف
                        </button>


                        <button
                            type="button"
                            onclick="rejectDeleteRequest(${realIndex})"
                            style="
                                flex:1;
                                min-width:140px;
                                padding:12px;
                                border:none;
                                border-radius:8px;
                                background:#d92d20;
                                color:white;
                                font-size:15px;
                                font-weight:bold;
                                cursor:pointer;
                            "
                        >
                            ❌ رفض الطلب
                        </button>

                    </div>

                `;

            }

            else if (
                request.status === "approved"
            ) {

                buttons = `

                    <div style="
                        margin-top:15px;
                        padding:12px;
                        background:#e8f7ee;
                        border-radius:8px;
                        color:#198754;
                        font-weight:bold;
                    ">

                        ✅ تمت الموافقة على الحذف

                        <br>

                        <small>
                            بواسطة: ${request.reviewedBy || "المدير"}
                            <br>
                            ${request.reviewDate || ""}
                        </small>

                    </div>

                `;

            }

            else if (
                request.status === "rejected"
            ) {

                buttons = `

                    <div style="
                        margin-top:15px;
                        padding:12px;
                        background:#fff0f0;
                        border-radius:8px;
                        color:#d92d20;
                        font-weight:bold;
                    ">

                        ❌ تم رفض طلب الحذف

                        <br>

                        <small>
                            بواسطة: ${request.reviewedBy || "المدير"}
                            <br>
                            ${request.reviewDate || ""}
                        </small>

                    </div>

                `;

            }


            container.innerHTML += `

                <div class="department-result"
                     style="
                        margin-bottom:20px;
                     ">

                    <h2>
                        🗑️ طلب حذف
                        ${request.section || ""}
                    </h2>


                    <p>
                        <strong>
                            اسم العربية:
                        </strong>

                        ${request.carName || "غير موجود"}
                    </p>


                    <p>
                        <strong>
                            رقم العربية:
                        </strong>

                        ${request.carNumber || "غير موجود"}
                    </p>


                    <p>
                        <strong>
                            طلب الحذف بواسطة:
                        </strong>

                        ${request.requestedBy || "غير معروف"}
                    </p>


                    <p>
                        <strong>
                            حساب المستخدم:
                        </strong>

                        ${request.requestedByUsername || "غير معروف"}
                    </p>


                    <p>
                        <strong>
                            سبب الحذف:
                        </strong>

                        ${request.reason || "لا يوجد"}
                    </p>


                    <p>
                        <strong>
                            تاريخ الطلب:
                        </strong>

                        ${request.requestDate || "غير موجود"}
                    </p>


                    <p>
                        <strong>
                            حالة الطلب:
                        </strong>

                        ${
                            request.status === "pending"
                                ? "⏳ في انتظار الموافقة"
                                : request.status === "approved"
                                    ? "✅ تمت الموافقة"
                                    : "❌ مرفوض"
                        }
                    </p>


                    ${buttons}

                </div>

            `;

        }
    );


    updateDeleteRequestsCount();

}


// ============================================================
// موافقة المدير على طلب الحذف
// ============================================================

function approveDeleteRequest(
    requestIndex
) {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        alert(
            "هذه العملية متاحة للمدير فقط ❌"
        );

        return;

    }


    const requests =
        getDeleteRequests();


    const request =
        requests[requestIndex];


    if (!request) {

        alert(
            "طلب الحذف غير موجود ❌"
        );

        return;

    }


    if (
        request.status !== "pending"
    ) {

        alert(
            "تم التعامل مع هذا الطلب من قبل."
        );

        return;

    }


    const confirmed =
        confirm(
            "⚠️ هل تريد الموافقة على حذف هذا البيان؟"
        );


    if (!confirmed) {
        return;
    }


    let records =
        getRecordsFromStorage(
            request.storageName
        );


    let recordIndex =
        records.findIndex(
            function(record) {

                return (
                    record &&
                    record.recordId ===
                    request.recordId
                );

            }
        );


    if (
        recordIndex === -1 &&
        request.recordIndex >= 0 &&
        request.recordIndex < records.length
    ) {

        recordIndex =
            request.recordIndex;

    }


    if (
        recordIndex === -1
    ) {

        request.status =
            "approved";

        request.reviewedBy =
            user.name;

        request.reviewDate =
            getCurrentDateTime();

        request.result =
            "البيان كان محذوفًا بالفعل";


        requests[requestIndex] =
            request;


        saveDeleteRequests(
            requests
        );


        alert(
            "تم اعتماد الطلب، ولكن البيان غير موجود لأنه تم حذفه بالفعل."
        );


        displayDeleteRequests();

        return;

    }


    records.splice(
        recordIndex,
        1
    );


    saveRecordsToStorage(
        request.storageName,
        records
    );


    request.status =
        "approved";

    request.reviewedBy =
        user.name;

    request.reviewDate =
        getCurrentDateTime();

    request.result =
        "تم حذف البيان";


    requests[requestIndex] =
        request;


    saveDeleteRequests(
        requests
    );


    alert(
        "تمت الموافقة على الطلب وحذف البيان بنجاح ✅"
    );


    displayDeleteRequests();

    displayAllRecords();

}


// ============================================================
// رفض طلب الحذف
// ============================================================

function rejectDeleteRequest(
    requestIndex
) {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        alert(
            "هذه العملية متاحة للمدير فقط ❌"
        );

        return;

    }


    const requests =
        getDeleteRequests();


    const request =
        requests[requestIndex];


    if (!request) {

        alert(
            "طلب الحذف غير موجود ❌"
        );

        return;

    }


    if (
        request.status !== "pending"
    ) {

        alert(
            "تم التعامل مع هذا الطلب من قبل."
        );

        return;

    }


    const reason =
        prompt(
            "اكتب سبب رفض طلب الحذف (اختياري):"
        );


    if (
        reason === null
    ) {

        return;

    }


    request.status =
        "rejected";

    request.reviewedBy =
        user.name;

    request.reviewDate =
        getCurrentDateTime();

    request.rejectionReason =
        reason.trim();


    requests[requestIndex] =
        request;


    saveDeleteRequests(
        requests
    );


    alert(
        "تم رفض طلب الحذف ❌"
    );


    displayDeleteRequests();

}


// ============================================================
// إضافة recordId للسجلات القديمة
// ============================================================

function ensureRecordIds() {

    const storages = [

        "wiringRecords",

        "ltRecords",

        "htRecords",

        "installationRecords",

        "finalRecords"

    ];


    storages.forEach(
        function(storageName) {

            const records =
                getRecordsFromStorage(
                    storageName
                );


            let changed = false;


            records.forEach(
                function(record) {

                    if (
                        record &&
                        !record.recordId
                    ) {

                        record.recordId =
                            generateRecordId();

                        changed = true;

                    }

                }
            );


            if (changed) {

                saveRecordsToStorage(
                    storageName,
                    records
                );

            }

        }
    );

}


// ============================================================
// حفظ Wiring
// ============================================================

function saveWiring() {

    const carName =
        document.getElementById(
            "wiringCarName"
        ).value.trim();


    const carNumber =
        document.getElementById(
            "wiringCarNumber"
        ).value.trim();


    const done =
        document.getElementById(
            "wiringDone"
        ).value;


    const notes =
        document.getElementById(
            "wiringNotes"
        ).value.trim();


    const message =
        document.getElementById(
            "wiringMessage"
        );


    if (
        !carName ||
        !carNumber ||
        !done
    ) {

        if (message) {

            message.innerText =
                "من فضلك املأ البيانات المطلوبة";

        }

        return;

    }


    let records =
        getRecordsFromStorage(
            "wiringRecords"
        );


    const user =
        getCurrentUser();


    const record = {

        recordId:
            generateRecordId(),

        carName:
            carName,

        carNumber:
            carNumber,

        done:
            done,

        notes:
            notes,

        date:
            getCurrentDateTime(),

        addedBy:
            user
                ? user.name
                : "Unknown"

    };


    records.push(
        record
    );


    saveRecordsToStorage(
        "wiringRecords",
        records
    );


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح ✅";

    }


    clearInput("wiringCarName");
    clearInput("wiringCarNumber");
    clearInput("wiringDone");
    clearInput("wiringNotes");


    displayWiringRecords();

}


// ============================================================
// عرض Wiring
// ============================================================

function displayWiringRecords() {

    displayDepartmentRecords(
        "wiringRecords",
        "wiringRecords"
    );

}


// ============================================================
// حفظ LT
// ============================================================

function saveLT() {

    const carName =
        document.getElementById(
            "ltCarName"
        ).value.trim();


    const carNumber =
        document.getElementById(
            "ltCarNumber"
        ).value.trim();


    const device =
        document.getElementById(
            "ltDevice"
        ).value.trim();


    const socket =
        document.getElementById(
            "ltSocket"
        ).value.trim();


    const notes =
        document.getElementById(
            "ltNotes"
        ).value.trim();


    const person =
        document.getElementById(
            "ltPerson"
        ).value.trim();


    const message =
        document.getElementById(
            "ltMessage"
        );


    if (
        !carName ||
        !carNumber ||
        !device ||
        !socket ||
        !person
    ) {

        if (message) {

            message.innerText =
                "من فضلك املأ البيانات المطلوبة";

        }

        return;

    }


    let records =
        getRecordsFromStorage(
            "ltRecords"
        );


    const user =
        getCurrentUser();


    const record = {

        recordId:
            generateRecordId(),

        carName:
            carName,

        carNumber:
            carNumber,

        device:
            device,

        socket:
            socket,

        notes:
            notes,

        person:
            person,

        date:
            getCurrentDateTime(),

        addedBy:
            user
                ? user.name
                : "Unknown"

    };


    records.push(
        record
    );


    saveRecordsToStorage(
        "ltRecords",
        records
    );


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح ✅";

    }


    clearInput("ltCarName");
    clearInput("ltCarNumber");
    clearInput("ltDevice");
    clearInput("ltSocket");
    clearInput("ltNotes");
    clearInput("ltPerson");


    displayLTRecords();

}


// ============================================================
// عرض LT
// ============================================================

function displayLTRecords() {

    displayDepartmentRecords(
        "ltRecords",
        "ltRecords"
    );

}


// ============================================================
// حفظ HT
// ============================================================

function saveHT() {

    const carName =
        document.getElementById(
            "htCarName"
        ).value.trim();


    const carNumber =
        document.getElementById(
            "htCarNumber"
        ).value.trim();


    const done =
        document.getElementById(
            "htDone"
        ).value;


    const notes =
        document.getElementById(
            "htNotes"
        ).value.trim();


    const message =
        document.getElementById(
            "htMessage"
        );


    if (
        !carName ||
        !carNumber ||
        !done
    ) {

        if (message) {

            message.innerText =
                "من فضلك املأ البيانات المطلوبة";

        }

        return;

    }


    let records =
        getRecordsFromStorage(
            "htRecords"
        );


    const user =
        getCurrentUser();


    const record = {

        recordId:
            generateRecordId(),

        carName:
            carName,

        carNumber:
            carNumber,

        done:
            done,

        notes:
            notes,

        date:
            getCurrentDateTime(),

        addedBy:
            user
                ? user.name
                : "Unknown"

    };


    records.push(
        record
    );


    saveRecordsToStorage(
        "htRecords",
        records
    );


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح ✅";

    }


    clearInput("htCarName");
    clearInput("htCarNumber");
    clearInput("htDone");
    clearInput("htNotes");


    displayHTRecords();

}


// ============================================================
// عرض HT
// ============================================================

function displayHTRecords() {

    displayDepartmentRecords(
        "htRecords",
        "htRecords"
    );

}


// ============================================================
// حفظ التركيبات
// ============================================================

function saveInstallation() {

    const carName =
        document.getElementById(
            "installationCarName"
        ).value.trim();


    const carNumber =
        document.getElementById(
            "installationCarNumber"
        ).value.trim();


    const done =
        document.getElementById(
            "installationDone"
        ).value;


    const notes =
        document.getElementById(
            "installationNotes"
        ).value.trim();


    const message =
        document.getElementById(
            "installationMessage"
        );


    if (
        !carName ||
        !carNumber ||
        !done
    ) {

        if (message) {

            message.innerText =
                "من فضلك املأ البيانات المطلوبة";

        }

        return;

    }


    let records =
        getRecordsFromStorage(
            "installationRecords"
        );


    const user =
        getCurrentUser();


    const record = {

        recordId:
            generateRecordId(),

        carName:
            carName,

        carNumber:
            carNumber,

        done:
            done,

        notes:
            notes,

        date:
            getCurrentDateTime(),

        addedBy:
            user
                ? user.name
                : "Unknown"

    };


    records.push(
        record
    );


    saveRecordsToStorage(
        "installationRecords",
        records
    );


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح ✅";

    }


    clearInput("installationCarName");
    clearInput("installationCarNumber");
    clearInput("installationDone");
    clearInput("installationNotes");


    displayInstallationRecords();

}


// ============================================================
// عرض التركيبات
// ============================================================

function displayInstallationRecords() {

    displayDepartmentRecords(
        "installationRecords",
        "installationRecords"
    );

}


// ============================================================
// حفظ Final
// ============================================================

function saveFinal() {

    const user =
        getCurrentUser();


    if (
        !user ||
        !canOpenFinal(user)
    ) {

        alert(
            "ليس لديك صلاحية للدخول إلى الفنش النهائي ❌"
        );


        window.location.href =
            "index.html";

        return;

    }


    const carName =
        document.getElementById(
            "finalCarName"
        ).value.trim();


    const carNumber =
        document.getElementById(
            "finalCarNumber"
        ).value.trim();


    const done =
        document.getElementById(
            "finalDone"
        ).value;


    const notes =
        document.getElementById(
            "finalNotes"
        ).value.trim();


    const message =
        document.getElementById(
            "finalMessage"
        );


    if (
        !carName ||
        !carNumber ||
        !done
    ) {

        if (message) {

            message.innerText =
                "من فضلك املأ البيانات المطلوبة";

        }

        return;

    }


    let records =
        getRecordsFromStorage(
            "finalRecords"
        );


    const record = {

        recordId:
            generateRecordId(),

        carName:
            carName,

        carNumber:
            carNumber,

        done:
            done,

        notes:
            notes,

        date:
            getCurrentDateTime(),

        addedBy:
            user.name

    };


    records.push(
        record
    );


    saveRecordsToStorage(
        "finalRecords",
        records
    );


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح ✅";

    }


    clearInput("finalCarName");
    clearInput("finalCarNumber");
    clearInput("finalDone");
    clearInput("finalNotes");


    displayFinalRecords();

}


// ============================================================
// عرض Final
// ============================================================

function displayFinalRecords() {

    displayDepartmentRecords(
        "finalRecords",
        "finalRecords"
    );

}


// ============================================================
// عرض سجلات أي قسم
// ============================================================

function displayDepartmentRecords(
    storageName,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    const records =
        getRecordsFromStorage(
            storageName
        );


    container.innerHTML = "";


    const user =
        getCurrentUser();


    records.forEach(
        function(record, index) {

            const hasPendingRequest =
                getDeleteRequests().some(
                    function(request) {

                        return (
                            request.status === "pending" &&
                            request.storageName === storageName &&
                            request.recordId === record.recordId
                        );

                    }
                );


            let deleteButton = "";


            if (user) {

                if (
                    user.role === "admin"
                ) {

                    deleteButton = `

                        <button
                            type="button"
                            onclick="deleteRecord('${storageName}', ${index})"
                            style="
                                margin-top:15px;
                                width:100%;
                                padding:12px;
                                border:none;
                                border-radius:8px;
                                background:#d92d20;
                                color:white;
                                font-size:15px;
                                font-weight:bold;
                                cursor:pointer;
                            "
                        >
                            🗑️ حذف البيان
                        </button>

                    `;

                }

                else {

                    if (hasPendingRequest) {

                        deleteButton = `

                            <div style="
                                margin-top:15px;
                                padding:12px;
                                border-radius:8px;
                                background:#fff4e5;
                                color:#b54708;
                                font-weight:bold;
                                text-align:center;
                            ">

                                ⏳ تم إرسال طلب الحذف
                                <br>
                                في انتظار موافقة المدير

                            </div>

                        `;

                    }

                    else {

                        deleteButton = `

                            <button
                                type="button"
                                onclick="deleteRecord('${storageName}', ${index})"
                                style="
                                    margin-top:15px;
                                    width:100%;
                                    padding:12px;
                                    border:none;
                                    border-radius:8px;
                                    background:#d92d20;
                                    color:white;
                                    font-size:15px;
                                    font-weight:bold;
                                    cursor:pointer;
                                "
                            >
                                🗑️ طلب حذف البيان
                            </button>

                        `;

                    }

                }

            }


            let extraFields = "";


            if (record.device) {

                extraFields += `

                    <p>

                        <strong>
                            اسم الجهاز:
                        </strong>

                        ${record.device}

                    </p>

                `;

            }


            if (record.socket) {

                extraFields += `

                    <p>

                        <strong>
                            اسم السوكيت:
                        </strong>

                        ${record.socket}

                    </p>

                `;

            }


            if (record.person) {

                extraFields += `

                    <p>

                        <strong>
                            اسم الشخص:
                        </strong>

                        ${record.person}

                    </p>

                `;

            }


            container.innerHTML += `

                <div class="record">

                    <h3>

                        📅 تاريخ التسجيل:

                        ${record.date || "غير موجود"}

                    </h3>


                    <p>

                        <strong>
                            اسم العربية:
                        </strong>

                        ${record.carName || "غير موجود"}

                    </p>


                    <p>

                        <strong>
                            رقم العربية:
                        </strong>

                        ${record.carNumber || "غير موجود"}

                    </p>


                    ${extraFields}


                    <p>

                        <strong>
                            تم الانتهاء:
                        </strong>

                        ${record.done || "غير محددة"}

                    </p>


                    <p>

                        <strong>
                            الملاحظات:
                        </strong>

                        ${record.notes || "لا يوجد"}

                    </p>


                    ${
                        record.addedBy
                        ? `

                            <p>

                                <strong>
                                    تم التسجيل بواسطة:
                                </strong>

                                ${record.addedBy}

                            </p>

                        `
                        : ""
                    }


                    ${deleteButton}

                </div>

            `;

        }
    );

}


// ============================================================
// البحث عن سيارة
// ============================================================

function searchCar() {

    const input =
        document.getElementById(
            "searchCarNumber"
        );


    const result =
        document.getElementById(
            "searchResult"
        );


    if (
        !input ||
        !result
    ) {

        return;

    }


    const number =
        input.value.trim();


    if (!number) {

        result.innerHTML = `

            <div class="error">

                من فضلك اكتب رقم العربية

            </div>

        `;

        return;

    }


    const sections = [

        {
            name:
                "🔌 قسم Wiring",

            storage:
                "wiringRecords"
        },

        {
            name:
                "⚡ قسم LT",

            storage:
                "ltRecords"
        },

        {
            name:
                "⚡ قسم HT",

            storage:
                "htRecords"
        },

        {
            name:
                "🔧 قسم التركيبات",

            storage:
                "installationRecords"
        },

        {
            name:
                "✅ قسم الفنش النهائي",

            storage:
                "finalRecords"
        }

    ];


    result.innerHTML = `

        <div class="search-title">

            <h2>

                بيانات العربية رقم:

                ${number}

            </h2>

        </div>

    `;


    sections.forEach(
        function(section) {

            const records =
                getRecordsFromStorage(
                    section.storage
                );


            const carRecords =
                records.filter(
                    function(record) {

                        if (!record) {
                            return false;
                        }


                        const carNumber =
                            String(
                                record.carNumber || ""
                            )
                            .trim()
                            .toLowerCase();


                        return (
                            carNumber ===
                            number.toLowerCase()
                        );

                    }
                );


            if (
                carRecords.length > 0
            ) {

                carRecords.forEach(
                    function(record) {

                        let extraFields = "";


                        if (record.device) {

                            extraFields += `

                                <p>

                                    <strong>
                                        اسم الجهاز:
                                    </strong>

                                    ${record.device}

                                </p>

                            `;

                        }


                        if (record.socket) {

                            extraFields += `

                                <p>

                                    <strong>
                                        اسم السوكيت:
                                    </strong>

                                    ${record.socket}

                                </p>

                            `;

                        }


                        if (record.person) {

                            extraFields += `

                                <p>

                                    <strong>
                                        اسم الشخص:
                                    </strong>

                                    ${record.person}

                                </p>

                            `;

                        }


                        result.innerHTML += `

                            <div class="department-result">

                                <h2>
                                    ${section.name}
                                </h2>


                                <p>
                                    <strong>
                                        اسم العربية:
                                    </strong>

                                    ${record.carName || "غير موجود"}
                                </p>


                                <p>
                                    <strong>
                                        رقم العربية:
                                    </strong>

                                    ${record.carNumber || "غير موجود"}
                                </p>


                                ${extraFields}


                                <p>
                                    <strong>
                                        الحالة:
                                    </strong>

                                    ${record.done || "غير محددة"}
                                </p>


                                <p>
                                    <strong>
                                        الملاحظات:
                                    </strong>

                                    ${record.notes || "لا يوجد"}
                                </p>


                                <p>
                                    <strong>
                                        تاريخ التسجيل:
                                    </strong>

                                    ${record.date || "غير موجود"}
                                </p>


                                ${
                                    record.addedBy
                                    ? `

                                        <p>

                                            <strong>
                                                تم التسجيل بواسطة:
                                            </strong>

                                            ${record.addedBy}

                                        </p>

                                    `
                                    : ""
                                }

                            </div>

                        `;

                    }
                );

            }

            else {

                result.innerHTML += `

                    <div class="department-result no-data">

                        <h2>

                            ${section.name}

                        </h2>


                        <div class="no-car">

                            ❌ لا يوجد بيانات لهذه العربية
                            في هذا القسم

                        </div>

                    </div>

                `;

            }

        }
    );

}


// ============================================================
// مسح input
// ============================================================

function clearInput(id) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value = "";

    }

}


// ============================================================
// عرض كل السجلات
// ============================================================

function displayAllRecords() {

    displayWiringRecords();

    displayLTRecords();

    displayHTRecords();

    displayInstallationRecords();

    displayFinalRecords();

}


// ============================================================
// تشغيل النظام
// ============================================================

ensureRecordIds();

protectPage();

setupDashboard();

displayAllRecords();

displayDeleteRequests();


// ============================================================
// تحديث طلبات الحذف تلقائيًا
// ============================================================

setInterval(
    function() {

        updateDeleteRequestsCount();

        displayDeleteRequests();

    },
    3000
);