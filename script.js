// ============================================================
// نظام إدارة بيانات العمل
// Supabase + الحسابات + الصلاحيات + الأقسام
// + البحث + طلبات حذف بموافقة المدير
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://gzyybadyaunizdlvmcle.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_zg4OnUfu83dzvD_GOIgarA__gbaXCEO";

window.supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
// ============================================================
// الحسابات
// ============================================================

const users = {

    Yosry: {
        password: "0111252",
        role: "admin",
        name: "Yosry"
    },

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
// أسماء الأقسام
// ============================================================

const departmentNames = {

    wiring:
        "قسم Wiring",

    lt:
        "قسم LT",

    ht:
        "قسم HT",

    installation:
        "قسم التركيبات",

    final:
        "قسم الفنش النهائي"

};


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
// الصفحة الحالية
// ============================================================

function getCurrentPage() {

    let page =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (!page) {
        page = "index.html";
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

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");

    if (!usernameInput || !passwordInput) {
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {

        if (message) {
            message.innerText =
                "من فضلك اكتب اسم المستخدم وكلمة السر";
            message.style.color = "red";
        }

        return;
    }

    // البحث عن المستخدم بدون حساسية لحالة الحروف
    const foundUsername = Object.keys(users).find(function(name) {

        return name.toLowerCase() === username.toLowerCase();

    });

    if (!foundUsername) {

        if (message) {
            message.innerText =
                "اسم المستخدم غير موجود ❌";
            message.style.color = "red";
        }

        return;
    }

    const userData = users[foundUsername];

    if (String(userData.password) !== String(password)) {

        if (message) {
            message.innerText =
                "كلمة المرور غير صحيحة ❌";
            message.style.color = "red";
        }

        return;
    }

    const currentUser = {

        username: foundUsername,

        role: userData.role,

        name: userData.name

    };

    // حفظ تسجيل الدخول
    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    // الانتقال للرئيسية
    window.location.href = "index.html";

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
            window.location.href = "wiring.html";
        }

        else if (section === "lt") {
            window.location.href = "lt.html";
        }

        else if (section === "ht") {
            window.location.href = "ht.html";
        }

        else if (section === "installation") {
            window.location.href = "installation.html";
        }

        else if (section === "final") {
            window.location.href = "final.html";
        }

        else if (section === "search") {
            window.location.href = "search.html";
        }

        else if (section === "deleteRequests") {
            window.location.href = "deleteRequests.html";
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


    if (section === "wiring") {
        window.location.href = "wiring.html";
    }

    else if (section === "lt") {
        window.location.href = "lt.html";
    }

    else if (section === "ht") {
        window.location.href = "ht.html";
    }

    else if (section === "installation") {
        window.location.href = "installation.html";
    }

}


// ============================================================
// تجهيز Dashboard
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

        const roles = {

            admin: "Admin",

            wiring: "Wiring",

            lt: "LT",

            ht: "HT",

            installation: "Installation"

        };


        roleElement.innerText =
            roles[user.role] || "Worker";

    }


    const sectionCards =
        document.querySelectorAll(
            ".section-card"
        );


    sectionCards.forEach(
        function(card) {

            card.style.display = "";

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
// تحويل القسم إلى اسم Supabase
// ============================================================

function getDepartmentFromStorage(
    storageName
) {

    const map = {

        wiringRecords:
            "wiring",

        ltRecords:
            "lt",

        htRecords:
            "ht",

        installationRecords:
            "installation",

        finalRecords:
            "final"

    };


    return (
        map[storageName] ||
        storageName
    );

}


// ============================================================
// تحويل قسم Supabase إلى اسم التخزين القديم
// ============================================================

function getStorageFromDepartment(
    department
) {

    const map = {

        wiring:
            "wiringRecords",

        lt:
            "ltRecords",

        ht:
            "htRecords",

        installation:
            "installationRecords",

        final:
            "finalRecords"

    };


    return (
        map[department] ||
        department
    );

}


// ============================================================
// تحويل سجل Supabase إلى شكل النظام
// ============================================================

function normalizeRecord(record) {

    if (!record) {
        return null;
    }


    return {

        recordId:
            record.id,

        id:
            record.id,

        carName:
            record.car_name || "",

        carNumber:
            record.car_number || "",

        done:
            record.done || "",

        notes:
            record.notes || "",

        date:
            record.date || "",

        addedBy:
            record.added_by || "",

        department:
            record.department || "",

        device:
            record.device || "",

        socket:
            record.socket || "",

        person:
            record.person || ""

    };

}


// ============================================================
// جلب السجلات من Supabase
// ============================================================

async function getAllSupabaseRecords() {

    if (!supabaseClient) {

        console.error(
            "Supabase client غير موجود"
        );

        return [];

    }


    try {

        const result =
            await supabaseClient
                .from("records")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: false
                    }
                );


        if (result.error) {

            console.error(
                "Supabase SELECT Error:",
                result.error
            );

            return [];

        }


        return (
            result.data || []
        )
        .map(
            normalizeRecord
        )
        .filter(
            Boolean
        );

    }

    catch (error) {

        console.error(
            "Supabase Connection Error:",
            error
        );

        return [];

    }

}


// ============================================================
// جلب سجلات قسم معين
// ============================================================

async function getDepartmentRecordsFromSupabase(
    storageName
) {

    const department =
        getDepartmentFromStorage(
            storageName
        );


    if (!supabaseClient) {
        return [];
    }


    try {

        const result =
            await supabaseClient
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
                "Supabase Department Error:",
                result.error
            );

            return [];

        }


        return (
            result.data || []
        )
        .map(
            normalizeRecord
        )
        .filter(
            Boolean
        );

    }

    catch (error) {

        console.error(
            error
        );

        return [];

    }

}


// ============================================================
// حفظ سجل في Supabase
// ============================================================

async function saveRecordToSupabase(
    department,
    data
) {

    if (!supabaseClient) {

        alert(
            "❌ Supabase غير متصل"
        );

        return null;

    }


    const payload = {

        department:
            department,

        car_name:
            data.carName,

        car_number:
            data.carNumber,

        done:
            data.done,

        notes:
            data.notes || "",

        date:
            data.date,

        added_by:
            data.addedBy || "",

        device:
            data.device || "",

        socket:
            data.socket || "",

        person:
            data.person || ""

    };


    try {

        const result =
            await supabaseClient
                .from("records")
                .insert(
                    payload
                )
                .select()
                .single();


        if (result.error) {

            console.error(
                "Supabase INSERT Error:",
                result.error
            );


            alert(
                "❌ تعذر حفظ البيانات في Supabase\n\n" +
                result.error.message
            );


            return null;

        }


        return normalizeRecord(
            result.data
        );

    }

    catch (error) {

        console.error(
            error
        );


        alert(
            "❌ تعذر الاتصال بـ Supabase"
        );


        return null;

    }

}


// ============================================================
// حذف سجل من Supabase
// ============================================================

async function deleteRecordFromSupabase(
    recordId
) {

    if (!supabaseClient) {

        alert(
            "❌ Supabase غير متصل"
        );

        return false;

    }


    try {

        const result =
            await supabaseClient
                .from("records")
                .delete()
                .eq(
                    "id",
                    recordId
                );


        if (result.error) {

            console.error(
                "Supabase DELETE Error:",
                result.error
            );


            alert(
                "❌ تعذر حذف البيان\n\n" +
                result.error.message
            );


            return false;

        }


        return true;

    }

    catch (error) {

        console.error(
            error
        );


        alert(
            "❌ تعذر الاتصال بـ Supabase"
        );


        return false;

    }

}


// ============================================================
// طلبات الحذف
// ============================================================

const DELETE_REQUESTS_STORAGE =
    "deleteRequests";


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

    }

    catch (error) {}


    return [];

}


function saveDeleteRequests(
    requests
) {

    localStorage.setItem(
        DELETE_REQUESTS_STORAGE,
        JSON.stringify(requests)
    );

}


function getPendingDeleteRequestsCount() {

    const requests =
        getDeleteRequests();


    return requests.filter(
        function(request) {

            return (
                request.status === "pending"
            );

        }
    ).length;

}


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


    const records =
        await getDepartmentRecordsFromSupabase(
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


    // المدير يحذف مباشرة

    if (
        user.role === "admin"
    ) {

        await deleteRecordDirectlyById(
            record.recordId
        );

        return;

    }


    // التأكد من صلاحية القسم

    const ownDepartments = {

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
        ownDepartments[user.role] ===
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


    const requests =
        getDeleteRequests();


    const alreadyPending =
        requests.some(
            function(request) {

                return (

                    request.status === "pending" &&

                    String(
                        request.recordId
                    ) ===
                    String(
                        record.recordId
                    )

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

    await displayDepartmentRecords(
        storageName,
        storageName
    );

}


// ============================================================
// حذف مباشر للمدير باستخدام ID
// ============================================================

async function deleteRecordDirectlyById(
    recordId
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


    const success =
        await deleteRecordFromSupabase(
            recordId
        );


    if (!success) {
        return;
    }


    alert(
        "تم حذف البيان بنجاح ✅"
    );


    await displayAllRecords();

    await updateDashboardStats();

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
// حذف مباشر بالـ index
// ============================================================

async function deleteRecordDirectly(
    storageName,
    index
) {

    const records =
        await getDepartmentRecordsFromSupabase(
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


    await deleteRecordDirectlyById(
        records[index].recordId
    );

}


// ============================================================
// إنشاء ID للطلبات
// ============================================================

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
// حفظ Wiring
// ============================================================

async function saveWiring() {

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


    const user =
        getCurrentUser();


    const record = {

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


    if (message) {

        message.innerText =
            "⏳ جاري حفظ البيانات...";

    }


    const saved =
        await saveRecordToSupabase(
            "wiring",
            record
        );


    if (!saved) {

        if (message) {

            message.innerText =
                "❌ فشل حفظ البيانات";

            message.style.color =
                "#d92d20";

        }

        return;

    }


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح في Supabase ✅";

        message.style.color =
            "#198754";

    }


    clearInput("wiringCarName");
    clearInput("wiringCarNumber");
    clearInput("wiringDone");
    clearInput("wiringNotes");


    await displayWiringRecords();

    await updateDashboardStats();

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


    const user =
        getCurrentUser();


    const record = {

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

        done:
            "نعم",

        date:
            getCurrentDateTime(),

        addedBy:
            user
                ? user.name
                : "Unknown"

    };


    if (message) {

        message.innerText =
            "⏳ جاري حفظ البيانات...";

    }


    const saved =
        await saveRecordToSupabase(
            "lt",
            record
        );


    if (!saved) {

        if (message) {

            message.innerText =
                "❌ فشل حفظ البيانات";

        }

        return;

    }


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح في Supabase ✅";

    }


    clearInput("ltCarName");
    clearInput("ltCarNumber");
    clearInput("ltDevice");
    clearInput("ltSocket");
    clearInput("ltNotes");
    clearInput("ltPerson");


    await displayLTRecords();

    await updateDashboardStats();

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


    const user =
        getCurrentUser();


    const record = {

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


    if (message) {

        message.innerText =
            "⏳ جاري حفظ البيانات...";

    }


    const saved =
        await saveRecordToSupabase(
            "ht",
            record
        );


    if (!saved) {

        if (message) {

            message.innerText =
                "❌ فشل حفظ البيانات";

        }

        return;

    }


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح في Supabase ✅";

    }


    clearInput("htCarName");
    clearInput("htCarNumber");
    clearInput("htDone");
    clearInput("htNotes");


    await displayHTRecords();

    await updateDashboardStats();

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


    const user =
        getCurrentUser();


    const record = {

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


    if (message) {

        message.innerText =
            "⏳ جاري حفظ البيانات...";

    }


    const saved =
        await saveRecordToSupabase(
            "installation",
            record
        );


    if (!saved) {

        if (message) {

            message.innerText =
                "❌ فشل حفظ البيانات";

        }

        return;

    }


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح في Supabase ✅";

    }


    clearInput("installationCarName");
    clearInput("installationCarNumber");
    clearInput("installationDone");
    clearInput("installationNotes");


    await displayInstallationRecords();

    await updateDashboardStats();

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


    const record = {

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


    if (message) {

        message.innerText =
            "⏳ جاري حفظ البيانات...";

    }


    const saved =
        await saveRecordToSupabase(
            "final",
            record
        );


    if (!saved) {

        if (message) {

            message.innerText =
                "❌ فشل حفظ البيانات";

        }

        return;

    }


    if (message) {

        message.innerText =
            "تم حفظ البيانات بنجاح في Supabase ✅";

    }


    clearInput("finalCarName");
    clearInput("finalCarNumber");
    clearInput("finalDone");
    clearInput("finalNotes");


    await displayFinalRecords();

    await updateDashboardStats();

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
        await getDepartmentRecordsFromSupabase(
            storageName
        );


    container.innerHTML = "";


    const user =
        getCurrentUser();


    if (
        records.length === 0
    ) {

        container.innerHTML = `

            <div class="department-result no-data">

                <div class="no-car">
                    لا توجد بيانات مسجلة حاليًا
                </div>

            </div>

        `;

        return;

    }


    const requests =
        getDeleteRequests();


    records.forEach(
        function(record, index) {

            const hasPendingRequest =
                requests.some(
                    function(request) {

                        return (

                            request.status === "pending" &&

                            String(
                                request.recordId
                            ) ===
                            String(
                                record.recordId
                            )

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

                        ${escapeHTML(record.device)}

                    </p>

                `;

            }


            if (record.socket) {

                extraFields += `

                    <p>

                        <strong>
                            اسم السوكيت:
                        </strong>

                        ${escapeHTML(record.socket)}

                    </p>

                `;

            }


            if (record.person) {

                extraFields += `

                    <p>

                        <strong>
                            اسم الشخص:
                        </strong>

                        ${escapeHTML(record.person)}

                    </p>

                `;

            }


            container.innerHTML += `

                <div class="record">

                    <h3>

                        📅 تاريخ التسجيل:

                        ${escapeHTML(
                            record.date ||
                            "غير موجود"
                        )}

                    </h3>


                    <p>

                        <strong>
                            اسم العربية:
                        </strong>

                        ${escapeHTML(
                            record.carName ||
                            "غير موجود"
                        )}

                    </p>


                    <p>

                        <strong>
                            رقم العربية:
                        </strong>

                        ${escapeHTML(
                            record.carNumber ||
                            "غير موجود"
                        )}

                    </p>


                    ${extraFields}


                    <p>

                        <strong>
                            تم الانتهاء:
                        </strong>

                        ${escapeHTML(
                            record.done ||
                            "غير محددة"
                        )}

                    </p>


                    <p>

                        <strong>
                            الملاحظات:
                        </strong>

                        ${escapeHTML(
                            record.notes ||
                            "لا يوجد"
                        )}

                    </p>


                    ${
                        record.addedBy
                        ? `

                            <p>

                                <strong>
                                    تم التسجيل بواسطة:
                                </strong>

                                ${escapeHTML(
                                    record.addedBy
                                )}

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


    if (!supabaseClient) {

        result.innerHTML = `

            <div class="error">

                ❌ Supabase غير متصل

            </div>

        `;

        return;

    }


    try {

        const response =
            await supabaseClient
                .from("records")
                .select("*")
                .eq(
                    "car_number",
                    number
                )
                .order(
                    "id",
                    {
                        ascending: false
                    }
                );


        if (response.error) {

            console.error(
                response.error
            );


            result.innerHTML = `

                <div class="error">

                    ❌ تعذر البحث في Supabase

                    <br>

                    ${escapeHTML(
                        response.error.message
                    )}

                </div>

            `;

            return;

        }


        const records =
            (
                response.data || []
            )
            .map(
                normalizeRecord
            )
            .filter(
                Boolean
            );


        result.innerHTML = `

            <div class="search-title">

                <h2>

                    بيانات العربية رقم:

                    ${escapeHTML(number)}

                </h2>

            </div>

        `;


        const departments = {

            wiring:
                "🔌 قسم Wiring",

            lt:
                "⚡ قسم LT",

            ht:
                "⚡ قسم HT",

            installation:
                "🔧 قسم التركيبات",

            final:
                "✅ قسم الفنش النهائي"

        };


        Object.keys(
            departments
        )
        .forEach(
            function(department) {

                const departmentRecords =
                    records.filter(
                        function(record) {

                            return (
                                record.department ===
                                department
                            );

                        }
                    );


                if (
                    departmentRecords.length === 0
                ) {

                    result.innerHTML += `

                        <div class="department-result no-data">

                            <h2>
                                ${departments[department]}
                            </h2>

                            <div class="no-car">

                                ❌ لا يوجد بيانات لهذه العربية
                                في هذا القسم

                            </div>

                        </div>

                    `;

                    return;

                }


                departmentRecords.forEach(
                    function(record) {

                        let extraFields = "";


                        if (record.device) {

                            extraFields += `

                                <p>

                                    <strong>
                                        اسم الجهاز:
                                    </strong>

                                    ${escapeHTML(
                                        record.device
                                    )}

                                </p>

                            `;

                        }


                        if (record.socket) {

                            extraFields += `

                                <p>

                                    <strong>
                                        اسم السوكيت:
                                    </strong>

                                    ${escapeHTML(
                                        record.socket
                                    )}

                                </p>

                            `;

                        }


                        if (record.person) {

                            extraFields += `

                                <p>

                                    <strong>
                                        اسم الشخص:
                                    </strong>

                                    ${escapeHTML(
                                        record.person
                                    )}

                                </p>

                            `;

                        }


                        result.innerHTML += `

                            <div class="department-result">

                                <h2>

                                    ${departments[department]}

                                </h2>


                                <p>

                                    <strong>
                                        اسم العربية:
                                    </strong>

                                    ${escapeHTML(
                                        record.carName ||
                                        "غير موجود"
                                    )}

                                </p>


                                <p>

                                    <strong>
                                        رقم العربية:
                                    </strong>

                                    ${escapeHTML(
                                        record.carNumber ||
                                        "غير موجود"
                                    )}

                                </p>


                                ${extraFields}


                                <p>

                                    <strong>
                                        الحالة:
                                    </strong>

                                    ${escapeHTML(
                                        record.done ||
                                        "غير محددة"
                                    )}

                                </p>


                                <p>

                                    <strong>
                                        الملاحظات:
                                    </strong>

                                    ${escapeHTML(
                                        record.notes ||
                                        "لا يوجد"
                                    )}

                                </p>


                                <p>

                                    <strong>
                                        تاريخ التسجيل:
                                    </strong>

                                    ${escapeHTML(
                                        record.date ||
                                        "غير موجود"
                                    )}

                                </p>


                                ${
                                    record.addedBy
                                    ? `

                                        <p>

                                            <strong>
                                                تم التسجيل بواسطة:
                                            </strong>

                                            ${escapeHTML(
                                                record.addedBy
                                            )}

                                        </p>

                                    `
                                    : ""
                                }

                            </div>

                        `;

                    }
                );

            }
        );

    }

    catch (error) {

        console.error(
            error
        );


        result.innerHTML = `

            <div class="error">

                ❌ حدث خطأ أثناء البحث

            </div>

        `;

    }

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
// إحصائيات Dashboard
// ============================================================

async function updateDashboardStats() {

    const elements = {

        total:
            document.getElementById(
                "totalRecords"
            ),

        completed:
            document.getElementById(
                "completedRecords"
            ),

        pending:
            document.getElementById(
                "pendingRecords"
            ),

        delayed:
            document.getElementById(
                "delayedRecords"
            ),

        today:
            document.getElementById(
                "todayRecords"
            )

    };


    if (
        !supabaseClient
    ) {
        return;
    }


    try {

        const result =
            await supabaseClient
                .from("records")
                .select("*");


        if (result.error) {

            console.error(
                result.error
            );

            return;

        }


        const records =
            result.data || [];


        const completed =
            records.filter(
                function(record) {

                    return (
                        record.done === "نعم"
                    );

                }
            ).length;


        const pending =
            records.filter(
                function(record) {

                    return (
                        record.done === "لا"
                    );

                }
            ).length;


        const today =
            new Date()
                .toLocaleDateString(
                    "ar-EG"
                );


        const todayCount =
            records.filter(
                function(record) {

                    if (!record.date) {
                        return false;
                    }


                    return String(
                        record.date
                    )
                    .includes(
                        today
                    );

                }
            ).length;


        if (elements.total) {

            elements.total.innerText =
                records.length;

        }


        if (elements.completed) {

            elements.completed.innerText =
                completed;

        }


        if (elements.pending) {

            elements.pending.innerText =
                pending;

        }


        if (elements.delayed) {

            elements.delayed.innerText =
                0;

        }


        if (elements.today) {

            elements.today.innerText =
                todayCount;

        }

    }

    catch (error) {

        console.error(
            error
        );

    }

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

                        return (
                            item.id ===
                            request.id
                        );

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
                            ${escapeHTML(
                                request.reviewedBy ||
                                "المدير"
                            )}

                            <br>

                            ${escapeHTML(
                                request.reviewDate ||
                                ""
                            )}
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
                            ${escapeHTML(
                                request.reviewedBy ||
                                "المدير"
                            )}

                            <br>

                            ${escapeHTML(
                                request.reviewDate ||
                                ""
                            )}
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
                        ${escapeHTML(
                            request.section || ""
                        )}
                    </h2>


                    <p>

                        <strong>
                            اسم العربية:
                        </strong>

                        ${escapeHTML(
                            request.carName ||
                            "غير موجود"
                        )}

                    </p>


                    <p>

                        <strong>
                            رقم العربية:
                        </strong>

                        ${escapeHTML(
                            request.carNumber ||
                            "غير موجود"
                        )}

                    </p>


                    <p>

                        <strong>
                            طلب الحذف بواسطة:
                        </strong>

                        ${escapeHTML(
                            request.requestedBy ||
                            "غير معروف"
                        )}

                    </p>


                    <p>

                        <strong>
                            حساب المستخدم:
                        </strong>

                        ${escapeHTML(
                            request.requestedByUsername ||
                            "غير معروف"
                        )}

                    </p>


                    <p>

                        <strong>
                            سبب الحذف:
                        </strong>

                        ${escapeHTML(
                            request.reason ||
                            "لا يوجد"
                        )}

                    </p>


                    <p>

                        <strong>
                            تاريخ الطلب:
                        </strong>

                        ${escapeHTML(
                            request.requestDate ||
                            "غير موجود"
                        )}

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
// موافقة المدير
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


    const success =
        await deleteRecordFromSupabase(
            request.recordId
        );


    if (!success) {
        return;
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

    await updateDashboardStats();

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
// حماية HTML من الأكواد
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// تشغيل النظام
// ============================================================

async function initializeSystem() {

    protectPage();

    setupDashboard();

    displayDeleteRequests();

    updateDeleteRequestsCount();


    const currentPage =
        getCurrentPage();


    if (
        currentPage !== "login.html"
    ) {

        await displayAllRecords();

        await updateDashboardStats();

    }

}


// ============================================================
// بدء التشغيل
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
// تحديث تلقائي للبيانات من كل الأجهزة
// ============================================================

setInterval(async function () {

    updateDeleteRequestsCount();

    displayDeleteRequests();

    // جلب أحدث البيانات من Supabase
    await displayAllRecords();

    // تحديث أرقام Dashboard
    await updateDashboardStats();

}, 3000);