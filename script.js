// ============================================================
// نظام إدارة بيانات العمل
// الحسابات + الصلاحيات + الأقسام + السجلات
// + البحث + طلبات حذف بموافقة المدير
// + Supabase
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

    wiring: [
        "index.html",
        "wiring.html",
        "chat.html"
    ],

    lt: [
        "index.html",
        "lt.html",
        "chat.html"
    ],

    ht: [
        "index.html",
        "ht.html",
        "chat.html"
    ],

    installation: [
        "index.html",
        "installation.html",
        "chat.html"
    ],

    final: [
        "index.html",
        "final.html",
        "chat.html"
    ]

};


// ============================================================
// أسماء الأقسام في Supabase
// ============================================================

const DEPARTMENT_NAMES = {

    wiring:
        "Wiring",

    lt:
        "LT",

    ht:
        "HT",

    installation:
        "Installation",

    final:
        "Final"

};


// ============================================================
// اسم تخزين طلبات الحذف
// ============================================================
//
// طلبات الحذف تظل في localStorage مؤقتًا.
// السجلات نفسها أصبحت في Supabase.
// ============================================================

const DELETE_REQUESTS_STORAGE =
    "deleteRequests";


// ============================================================
// التأكد من وجود Supabase
// ============================================================

function checkSupabase() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "Supabase client غير موجود."
        );

        return false;

    }

    return true;

}


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

        username:
            username,

        role:
            userData.role,

        name:
            userData.name

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

    if (
        section === "deleteRequests"
    ) {

        alert(
            "طلبات الحذف متاحة للمدير فقط ❌"
        );

        return;

    }

    if (
        section === "search"
    ) {

        alert(
            "ليس لديك صلاحية للدخول إلى سجل البيانات ❌"
        );

        return;

    }

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

    const nameElement =
        document.getElementById(
            "currentUserName"
        );

    if (nameElement) {

        nameElement.innerText =
            user.name;

    }

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
// تحويل Supabase record إلى الشكل القديم
// ============================================================

function convertSupabaseRecord(record) {

    if (!record) {
        return null;
    }

    return {

        id:
            record.id,

        recordId:
            record.id
                ? String(record.id)
                : generateRecordId(),

        carName:
            record.car_name || "",

        carNumber:
            record.car_number || "",

        device:
            record.device || "",

        socket:
            record.socket || "",

        done:
            record.done || "",

        notes:
            record.notes || "",

        person:
            record.person || "",

        date:
            record.created_at
                ? new Date(
                    record.created_at
                ).toLocaleString(
                    "ar-EG"
                )
                : "",

        addedBy:
            record.created_by || "",

        department:
            record.department || ""

    };

}


// ============================================================
// جلب سجلات قسم من Supabase
// ============================================================

async function getRecordsFromSupabase(
    department
) {

    if (!checkSupabase()) {

        return [];

    }

    const { data, error } =
        await supabaseClient
            .from("records")
            .select("*")
            .eq(
                "department",
                department
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Supabase SELECT Error:",
            error
        );

        return [];

    }

    return (
        data || []
    ).map(
        convertSupabaseRecord
    );

}


// ============================================================
// جلب كل السجلات
// ============================================================

async function getAllRecordsFromSupabase() {

    if (!checkSupabase()) {

        return [];

    }

    const { data, error } =
        await supabaseClient
            .from("records")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Supabase SELECT Error:",
            error
        );

        return [];

    }

    return (
        data || []
    ).map(
        convertSupabaseRecord
    );

}


// ============================================================
// حفظ سجل في Supabase
// ============================================================

async function saveRecordToSupabase(record) {

    if (!checkSupabase()) {

        throw new Error(
            "Supabase غير متصل"
        );

    }

    const { data, error } =
        await supabaseClient
            .from("records")
            .insert([record])
            .select();

    if (error) {

        console.error(
            "Supabase INSERT Error:",
            error
        );

        throw error;

    }

    return data;

}


// ============================================================
// حذف سجل من Supabase
// ============================================================

async function deleteRecordFromSupabase(
    id
) {

    if (!checkSupabase()) {

        throw new Error(
            "Supabase غير متصل"
        );

    }

    const { error } =
        await supabaseClient
            .from("records")
            .delete()
            .eq(
                "id",
                id
            );

    if (error) {

        console.error(
            "Supabase DELETE Error:",
            error
        );

        throw error;

    }

}


// ============================================================
// الحصول على السجلات - للتوافق مع الكود القديم
// ============================================================
//
// هذه الدالة أصبحت Async.
// أي كود جديد يجب أن يستخدم getRecordsFromSupabase.
// ============================================================

async function getRecordsFromStorage(
    storageName
) {

    const department =
        storageToDepartment(
            storageName
        );

    if (!department) {

        return [];

    }

    return await getRecordsFromSupabase(
        department
    );

}


// ============================================================
// تحويل اسم التخزين إلى القسم
// ============================================================

function storageToDepartment(
    storageName
) {

    const map = {

        wiringRecords:
            "Wiring",

        ltRecords:
            "LT",

        htRecords:
            "HT",

        installationRecords:
            "Installation",

        finalRecords:
            "Final"

    };

    return map[storageName] || null;

}


// ============================================================
// حفظ قديم - لم يعد مستخدمًا
// ============================================================

function saveRecordsToStorage(
    storageName,
    records
) {

    console.warn(
        "saveRecordsToStorage لم تعد مستخدمة. البيانات تحفظ في Supabase."
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

function saveDeleteRequests(
    requests
) {

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

async function requestDeleteRecord(
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

    // المدير يحذف مباشرة
    if (
        user.role === "admin"
    ) {

        await deleteRecordDirectly(
            storageName,
            index
        );

        return;

    }

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
        await getRecordsFromStorage(
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
                    String(request.recordId) ===
                    String(record.recordId)
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

    const deleteRequest = {

        id:
            generateRequestId(),

        storageName:
            storageName,

        recordId:
            record.recordId,

        recordIndex:
            index,

        supabaseId:
            record.id,

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

    await displayAllRecords();

}


// ============================================================
// حذف مباشر للمدير
// ============================================================

async function deleteRecordDirectly(
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
        await getRecordsFromStorage(
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

    if (!record.id) {

        alert(
            "تعذر معرفة رقم البيان في Supabase ❌"
        );

        return;

    }

    try {

        await deleteRecordFromSupabase(
            record.id
        );

        alert(
            "تم حذف البيان بنجاح ✅"
        );

        await displayAllRecords();

    } catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء حذف البيان ❌"
        );

    }

}


// ============================================================
// الدالة القديمة deleteRecord
// ============================================================

async function deleteRecord(
    storageName,
    index
) {

    await requestDeleteRecord(
        storageName,
        index
    );

}


// ============================================================
// حفظ Wiring
// ============================================================

async function saveWiring() {

    const carNameElement =
        document.getElementById(
            "wiringCarName"
        );

    const carNumberElement =
        document.getElementById(
            "wiringCarNumber"
        );

    const doneElement =
        document.getElementById(
            "wiringDone"
        );

    const notesElement =
        document.getElementById(
            "wiringNotes"
        );

    const message =
        document.getElementById(
            "wiringMessage"
        );

    if (
        !carNameElement ||
        !carNumberElement ||
        !doneElement
    ) {

        return;

    }

    const carName =
        carNameElement.value.trim();

    const carNumber =
        carNumberElement.value.trim();

    const done =
        doneElement.value;

    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";

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

    const user =
        getCurrentUser();

    try {

        await saveRecordToSupabase({

            department:
                "Wiring",

            car_name:
                carName,

            car_number:
                carNumber,

            done:
                done,

            notes:
                notes,

            created_by:
                user
                    ? user.name
                    : "Unknown"

        });

        if (message) {

            message.innerText =
                "تم حفظ البيانات في قاعدة البيانات بنجاح ✅";

        }

        clearInput(
            "wiringCarName"
        );

        clearInput(
            "wiringCarNumber"
        );

        clearInput(
            "wiringDone"
        );

        clearInput(
            "wiringNotes"
        );

        await displayWiringRecords();

    } catch (error) {

        if (message) {

            message.innerText =
                "حدث خطأ أثناء حفظ البيانات ❌";

        }

        alert(
            "تعذر حفظ البيانات في Supabase ❌\n\n" +
            (error.message || "")
        );

    }

}


// ============================================================
// عرض Wiring
// ============================================================

async function displayWiringRecords() {

    await displayDepartmentRecords(
        "wiringRecords",
        "wiringRecords"
    );

}


// ============================================================
// حفظ LT
// ============================================================

async function saveLT() {

    const carNameElement =
        document.getElementById(
            "ltCarName"
        );

    const carNumberElement =
        document.getElementById(
            "ltCarNumber"
        );

    const deviceElement =
        document.getElementById(
            "ltDevice"
        );

    const socketElement =
        document.getElementById(
            "ltSocket"
        );

    const notesElement =
        document.getElementById(
            "ltNotes"
        );

    const personElement =
        document.getElementById(
            "ltPerson"
        );

    const message =
        document.getElementById(
            "ltMessage"
        );

    if (
        !carNameElement ||
        !carNumberElement ||
        !deviceElement ||
        !socketElement ||
        !personElement
    ) {

        return;

    }

    const carName =
        carNameElement.value.trim();

    const carNumber =
        carNumberElement.value.trim();

    const device =
        deviceElement.value.trim();

    const socket =
        socketElement.value.trim();

    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";

    const person =
        personElement.value.trim();

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

    const user =
        getCurrentUser();

    try {

        await saveRecordToSupabase({

            department:
                "LT",

            car_name:
                carName,

            car_number:
                carNumber,

            device:
                device,

            socket:
                socket,

            notes:
                notes,

            person:
                person,

            created_by:
                user
                    ? user.name
                    : "Unknown"

        });

        if (message) {

            message.innerText =
                "تم حفظ البيانات في قاعدة البيانات بنجاح ✅";

        }

        clearInput("ltCarName");
        clearInput("ltCarNumber");
        clearInput("ltDevice");
        clearInput("ltSocket");
        clearInput("ltNotes");
        clearInput("ltPerson");

        await displayLTRecords();

    } catch (error) {

        if (message) {

            message.innerText =
                "حدث خطأ أثناء حفظ البيانات ❌";

        }

        alert(
            "تعذر حفظ البيانات في Supabase ❌\n\n" +
            (error.message || "")
        );

    }

}


// ============================================================
// عرض LT
// ============================================================

async function displayLTRecords() {

    await displayDepartmentRecords(
        "ltRecords",
        "ltRecords"
    );

}


// ============================================================
// حفظ HT
// ============================================================

async function saveHT() {

    const carNameElement =
        document.getElementById(
            "htCarName"
        );

    const carNumberElement =
        document.getElementById(
            "htCarNumber"
        );

    const doneElement =
        document.getElementById(
            "htDone"
        );

    const notesElement =
        document.getElementById(
            "htNotes"
        );

    const message =
        document.getElementById(
            "htMessage"
        );

    if (
        !carNameElement ||
        !carNumberElement ||
        !doneElement
    ) {

        return;

    }

    const carName =
        carNameElement.value.trim();

    const carNumber =
        carNumberElement.value.trim();

    const done =
        doneElement.value;

    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";

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

    const user =
        getCurrentUser();

    try {

        await saveRecordToSupabase({

            department:
                "HT",

            car_name:
                carName,

            car_number:
                carNumber,

            done:
                done,

            notes:
                notes,

            created_by:
                user
                    ? user.name
                    : "Unknown"

        });

        if (message) {

            message.innerText =
                "تم حفظ البيانات في قاعدة البيانات بنجاح ✅";

        }

        clearInput("htCarName");
        clearInput("htCarNumber");
        clearInput("htDone");
        clearInput("htNotes");

        await displayHTRecords();

    } catch (error) {

        if (message) {

            message.innerText =
                "حدث خطأ أثناء حفظ البيانات ❌";

        }

        alert(
            "تعذر حفظ البيانات في Supabase ❌\n\n" +
            (error.message || "")
        );

    }

}


// ============================================================
// عرض HT
// ============================================================

async function displayHTRecords() {

    await displayDepartmentRecords(
        "htRecords",
        "htRecords"
    );

}


// ============================================================
// حفظ التركيبات
// ============================================================

async function saveInstallation() {

    const carNameElement =
        document.getElementById(
            "installationCarName"
        );

    const carNumberElement =
        document.getElementById(
            "installationCarNumber"
        );

    const doneElement =
        document.getElementById(
            "installationDone"
        );

    const notesElement =
        document.getElementById(
            "installationNotes"
        );

    const message =
        document.getElementById(
            "installationMessage"
        );

    if (
        !carNameElement ||
        !carNumberElement ||
        !doneElement
    ) {

        return;

    }

    const carName =
        carNameElement.value.trim();

    const carNumber =
        carNumberElement.value.trim();

    const done =
        doneElement.value;

    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";

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

    const user =
        getCurrentUser();

    try {

        await saveRecordToSupabase({

            department:
                "Installation",

            car_name:
                carName,

            car_number:
                carNumber,

            done:
                done,

            notes:
                notes,

            created_by:
                user
                    ? user.name
                    : "Unknown"

        });

        if (message) {

            message.innerText =
                "تم حفظ البيانات في قاعدة البيانات بنجاح ✅";

        }

        clearInput(
            "installationCarName"
        );

        clearInput(
            "installationCarNumber"
        );

        clearInput(
            "installationDone"
        );

        clearInput(
            "installationNotes"
        );

        await displayInstallationRecords();

    } catch (error) {

        if (message) {

            message.innerText =
                "حدث خطأ أثناء حفظ البيانات ❌";

        }

        alert(
            "تعذر حفظ البيانات في Supabase ❌\n\n" +
            (error.message || "")
        );

    }

}


// ============================================================
// عرض التركيبات
// ============================================================

async function displayInstallationRecords() {

    await displayDepartmentRecords(
        "installationRecords",
        "installationRecords"
    );

}


// ============================================================
// حفظ Final
// ============================================================

async function saveFinal() {

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

    const carNameElement =
        document.getElementById(
            "finalCarName"
        );

    const carNumberElement =
        document.getElementById(
            "finalCarNumber"
        );

    const doneElement =
        document.getElementById(
            "finalDone"
        );

    const notesElement =
        document.getElementById(
            "finalNotes"
        );

    const message =
        document.getElementById(
            "finalMessage"
        );

    if (
        !carNameElement ||
        !carNumberElement ||
        !doneElement
    ) {

        return;

    }

    const carName =
        carNameElement.value.trim();

    const carNumber =
        carNumberElement.value.trim();

    const done =
        doneElement.value;

    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";

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

    try {

        await saveRecordToSupabase({

            department:
                "Final",

            car_name:
                carName,

            car_number:
                carNumber,

            done:
                done,

            notes:
                notes,

            created_by:
                user.name

        });

        if (message) {

            message.innerText =
                "تم حفظ البيانات في قاعدة البيانات بنجاح ✅";

        }

        clearInput(
            "finalCarName"
        );

        clearInput(
            "finalCarNumber"
        );

        clearInput(
            "finalDone"
        );

        clearInput(
            "finalNotes"
        );

        await displayFinalRecords();

    } catch (error) {

        if (message) {

            message.innerText =
                "حدث خطأ أثناء حفظ البيانات ❌";

        }

        alert(
            "تعذر حفظ البيانات في Supabase ❌\n\n" +
            (error.message || "")
        );

    }

}


// ============================================================
// عرض Final
// ============================================================

async function displayFinalRecords() {

    await displayDepartmentRecords(
        "finalRecords",
        "finalRecords"
    );

}


// ============================================================
// عرض سجلات أي قسم
// ============================================================

async function displayDepartmentRecords(
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
        await getRecordsFromStorage(
            storageName
        );

    container.innerHTML = "";

    const user =
        getCurrentUser();

    const deleteRequests =
        getDeleteRequests();

    if (
        records.length === 0
    ) {

        container.innerHTML = `

            <div class="no-data">

                لا توجد بيانات مسجلة حاليًا

            </div>

        `;

        return;

    }

    records.forEach(
        function(record, index) {

            const hasPendingRequest =
                deleteRequests.some(
                    function(request) {

                        return (
                            request.status === "pending" &&
                            request.storageName === storageName &&
                            String(request.recordId) ===
                            String(record.recordId)
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

async function searchCar() {

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

    result.innerHTML = `

        <div class="search-title">

            <h2>

                جاري البحث عن العربية رقم:

                ${number}

            </h2>

        </div>

    `;

    const allRecords =
        await getAllRecordsFromSupabase();

    const carRecords =
        allRecords.filter(
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
        carRecords.length === 0
    ) {

        result.innerHTML += `

            <div class="department-result no-data">

                <div class="no-car">

                    ❌ لا يوجد بيانات لهذه العربية

                </div>

            </div>

        `;

        return;

    }

    carRecords.forEach(
        function(record) {

            let sectionName =
                "القسم";

            if (
                record.department === "Wiring"
            ) {

                sectionName =
                    "🔌 قسم Wiring";

            }

            else if (
                record.department === "LT"
            ) {

                sectionName =
                    "⚡ قسم LT";

            }

            else if (
                record.department === "HT"
            ) {

                sectionName =
                    "⚡ قسم HT";

            }

            else if (
                record.department === "Installation"
            ) {

                sectionName =
                    "🔧 قسم التركيبات";

            }

            else if (
                record.department === "Final"
            ) {

                sectionName =
                    "✅ قسم الفنش النهائي";

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

            result.innerHTML += `

                <div class="department-result">

                    <h2>
                        ${sectionName}
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

                            بواسطة:
                            ${request.reviewedBy || "المدير"}

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

                            بواسطة:
                            ${request.reviewedBy || "المدير"}

                            <br>

                            ${request.reviewDate || ""}

                            ${
                                request.rejectionReason
                                ? `
                                    <br>
                                    السبب:
                                    ${request.rejectionReason}
                                `
                                : ""
                            }

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

async function approveDeleteRequest(
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

    try {

        if (
            request.supabaseId
        ) {

            await deleteRecordFromSupabase(
                request.supabaseId
            );

        }

        else {

            const records =
                await getRecordsFromStorage(
                    request.storageName
                );

            const record =
                records.find(
                    function(item) {

                        return (
                            String(item.recordId) ===
                            String(request.recordId)
                        );

                    }
                );

            if (
                record &&
                record.id
            ) {

                await deleteRecordFromSupabase(
                    record.id
                );

            }

        }

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

        await displayAllRecords();

    } catch (error) {

        console.error(error);

        alert(
            "حدث خطأ أثناء حذف البيان من Supabase ❌\n\n" +
            (error.message || "")
        );

    }

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
// إضافة IDs للسجلات القديمة
// ============================================================
//
// لم نعد نحتاج إليها لأن Supabase يعطي كل record رقم id.
// ============================================================

function ensureRecordIds() {

    return;

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

async function displayAllRecords() {

    await displayWiringRecords();

    await displayLTRecords();

    await displayHTRecords();

    await displayInstallationRecords();

    await displayFinalRecords();

}


// ============================================================
// تشغيل النظام
// ============================================================

async function initializeSystem() {

    ensureRecordIds();

    protectPage();

    setupDashboard();

    await displayAllRecords();

    displayDeleteRequests();

}


// ============================================================
// بدء النظام بعد تحميل الصفحة
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSystem
    );

}

else {

    initializeSystem();

}


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