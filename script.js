// ============================================================
// NERIC Team1underframe - Main Script
// Supabase + Users + Departments + Dashboard + Problems
// ============================================================

const SUPABASE_URL = "https://gzyybadyaunizdlvmcle.supabase.co";
const SUPABASE_KEY = "sb_publishable_zg4OnUfu83dzvD_GOIgarA__gbaXCEO";

window.supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// ============================================================
// USERS
// ============================================================

const users = {
  Yosry: { password: "0111252", role: "admin", name: "Yosry" },
  Zezo: { password: "58321476", role: "wiring", name: "Zezo" },
  Abdo: { password: "74185296", role: "wiring", name: "Abdo" },
  Osama: { password: "29481736", role: "lt", name: "Osama" },
  Yaser: { password: "63825194", role: "lt", name: "Yaser" },
  Seif: { password: "81573924", role: "lt", name: "Seif" },
  "Ahmed Ayman": { password: "47291638", role: "lt", name: "Ahmed Ayman" },
  Mamdouh: { password: "92638471", role: "ht", name: "Mamdouh" },
  Ali: { password: "35182749", role: "ht", name: "Ali" },
  Eid: { password: "68421937", role: "installation", name: "Eid" },
  Mosad: { password: "51963827", role: "installation", name: "Mosad" },
  "Mohamed Haitham": { password: "83746192", role: "installation", name: "Mohamed Haitham" }
};

const permissions = {
  admin: ["index.html","wiring.html","lt.html","ht.html","installation.html","final.html","search.html","problems.html","deleterequests.html","deleteRequests.html","chat.html"],
  wiring: ["index.html","wiring.html","problems.html","chat.html"],
  lt: ["index.html","lt.html","problems.html","chat.html"],
  ht: ["index.html","ht.html","problems.html","chat.html"],
  installation: ["index.html","installation.html","problems.html","chat.html"],
  final: ["index.html","final.html","problems.html","chat.html"]
};

const departmentNames = {
  wiring: "قسم Wiring",
  lt: "قسم LT",
  ht: "قسم HT",
  installation: "قسم التركيبات",
  final: "قسم الفنش النهائي"
};

// ============================================================
// AUTH / NAVIGATION
// ============================================================

function getCurrentUser() {
  try {
    const data = sessionStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Current user error:", error);
    return null;
  }
}

function getCurrentPage() {
  let page = window.location.pathname.split("/").pop().toLowerCase();
  return page || "index.html";
}

function canOpenFinal(user) {
  return !!user && (user.role === "admin" || user.username === "Osama" || user.username === "Mamdouh");
}

function getHomePage() {
  return "index.html";
}

function login() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");
  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    if (message) {
      message.innerText = "من فضلك اكتب اسم المستخدم وكلمة السر";
      message.style.color = "red";
    }
    return;
  }

  const foundUsername = Object.keys(users).find(
    name => name.toLowerCase() === username.toLowerCase()
  );

  if (!foundUsername) {
    if (message) {
      message.innerText = "❌ اسم المستخدم غير موجود";
      message.style.color = "red";
    }
    return;
  }

  const userData = users[foundUsername];
  if (String(userData.password) !== String(password)) {
    if (message) {
      message.innerText = "❌ كلمة المرور غير صحيحة";
      message.style.color = "red";
    }
    return;
  }

  sessionStorage.setItem("currentUser", JSON.stringify({
    username: foundUsername,
    role: userData.role,
    name: userData.name
  }));

  window.location.href = "index.html";
}

function goHome() {
  window.location.href = getCurrentUser() ? "index.html" : "login.html";
}

function protectPage() {
  const currentPage = getCurrentPage();
  if (currentPage === "login.html") return;

  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.role === "admin") return;

  if (currentPage === "index.html") return;

  if (currentPage === "final.html") {
    if (canOpenFinal(user)) return;
    alert("❌ ليس لديك صلاحية للدخول إلى الفنش النهائي");
    window.location.href = "index.html";
    return;
  }

  const allowedPages = permissions[user.role] || [];
  if (!allowedPages.includes(currentPage)) {
    alert("❌ ليس لديك صلاحية للدخول إلى هذه الصفحة");
    window.location.href = "index.html";
  }
}

function openSection(section) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (section === "problems") {
    window.location.href = "problems.html";
    return;
  }

  if (section === "deleteRequests") {
    if (user.role !== "admin") {
      alert("❌ طلبات الحذف متاحة للمدير فقط");
      return;
    }
    window.location.href = "deleteRequests.html";
    return;
  }

  if (section === "search") {
    if (user.role !== "admin") {
      alert("❌ البحث متاح للمدير فقط");
      return;
    }
    window.location.href = "search.html";
    return;
  }

  if (section === "final") {
    if (!canOpenFinal(user)) {
      alert("❌ ليس لديك صلاحية للدخول إلى الفنش النهائي");
      return;
    }
    window.location.href = "final.html";
    return;
  }

  if (user.role !== "admin" && user.role !== section) {
    alert("❌ ليس لديك صلاحية للدخول إلى القسم هذا");
    return;
  }

  const pages = {
    wiring: "wiring.html",
    lt: "lt.html",
    ht: "ht.html",
    installation: "installation.html",
    final: "final.html",
    search: "search.html"
  };

  if (pages[section]) window.location.href = pages[section];
}

// ============================================================
// DASHBOARD
// ============================================================

function setupDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const nameElement = document.getElementById("currentUserName");
  if (nameElement) nameElement.innerText = user.name;

  const roleElement = document.getElementById("currentUserRole");
  if (roleElement) {
    const roles = {
      admin: "Admin",
      wiring: "Wiring",
      lt: "LT",
      ht: "HT",
      installation: "Installation",
      final: "Final"
    };
    roleElement.innerText = roles[user.role] || "Worker";
  }

  const searchButton = document.querySelector('button[onclick="openSection(\'search\')"]');
  if (searchButton) searchButton.style.display = user.role === "admin" ? "" : "none";

  const deleteRequestsMenu = document.getElementById("deleteRequestsMenu");
  if (deleteRequestsMenu) {
    deleteRequestsMenu.style.display = user.role === "admin" ? "" : "none";
  }

  setupProblemsCard();
  updateDeleteRequestsCount();
}

function setupProblemsCard() {
  const candidates = [
    document.getElementById("problemRecords"),
    document.getElementById("problemsCard"),
    document.querySelector("[data-problems-card]")
  ].filter(Boolean);

  candidates.forEach(el => {
    const card = el.closest(".stat-card") || el;
    card.style.cursor = "pointer";
    if (!card.dataset.problemClickReady) {
      card.addEventListener("click", openProblemsPage);
      card.dataset.problemClickReady = "1";
    }
  });
}

function openProblemsPage() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  window.location.href = "problems.html";
}

function getCurrentDateTime() {
  return new Date().toLocaleString("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

// ============================================================
// STORAGE COMPATIBILITY
// ============================================================

function getDepartmentFromStorage(storageName) {
  const map = {
    wiringRecords: "wiring",
    ltRecords: "lt",
    htRecords: "ht",
    installationRecords: "installation",
    finalRecords: "final"
  };
  return map[storageName] || storageName;
}

function getStorageFromDepartment(department) {
  const map = {
    wiring: "wiringRecords",
    lt: "ltRecords",
    ht: "htRecords",
    installation: "installationRecords",
    final: "finalRecords"
  };
  return map[department] || department;
}

// ============================================================
// PROBLEM METADATA
//
// We intentionally keep the workflow inside the existing
// not_completed_reason column so this script does not require
// unknown/new Supabase columns.
// ============================================================

function makeProblemMeta(reason, status, resolvedBy, resolvedAt, reviewedBy, reviewedAt) {
  return JSON.stringify({
    __problem: true,
    reason: reason || "",
    status: status || "open",
    resolvedBy: resolvedBy || "",
    resolvedAt: resolvedAt || "",
    reviewedBy: reviewedBy || "",
    reviewedAt: reviewedAt || ""
  });
}

function readProblemMeta(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(String(value));
    return parsed && parsed.__problem === true ? parsed : null;
  } catch (_) {
    return null;
  }
}

function getProblemStatus(record) {
  if (!record || record.done !== "لا") return "none";
  const meta = readProblemMeta(record.notCompletedReason);
  return meta?.status || "open";
}

function getProblemReason(record) {
  const meta = readProblemMeta(record?.notCompletedReason);
  return meta ? (meta.reason || "") : (record?.notCompletedReason || record?.notes || "");
}

function isProblemRecord(record) {
  return !!record && record.done === "لا" && getProblemStatus(record) !== "resolved";
}

function isProblemPendingReview(record) {
  return !!record && record.done === "لا" && getProblemStatus(record) === "pending_review";
}

// ============================================================
// NORMALIZE
// ============================================================

function normalizeRecord(record) {
  if (!record) return null;

  const normalized = {
    recordId: record.Id ?? record.id ?? "",
    id: record.Id ?? record.id ?? "",
    carName: record.Car_name ?? record.car_name ?? "",
    carNumber: record.Car_number ?? record.car_number ?? "",
    done: record.Done ?? record.done ?? "",
    notes: record.Notes ?? record.notes ?? "",
    date: record.Created_at ?? record.created_at ?? "",
    addedBy: record.Created_by ?? record.created_by ?? "",
    department: record.Department ?? record.department ?? "",
    device: record.Device ?? record.device ?? "",
    socket: record.Socket ?? record.socket ?? "",
    person: record.Person ?? record.person ?? "",
    notCompletedReason: record.not_completed_reason ?? record.Not_completed_reason ?? ""
  };

  const meta = readProblemMeta(normalized.notCompletedReason);
  normalized.problemStatus = meta?.status || (normalized.done === "لا" ? "open" : "none");
  normalized.problemReason = meta?.reason || (
    normalized.done === "لا" ? normalized.notCompletedReason || normalized.notes : ""
  );
  normalized.problemResolvedBy = meta?.resolvedBy || "";
  normalized.problemResolvedAt = meta?.resolvedAt || "";
  normalized.problemReviewedBy = meta?.reviewedBy || "";
  normalized.problemReviewedAt = meta?.reviewedAt || "";

  return normalized;
}

// ============================================================
// SUPABASE READ
// ============================================================

async function getAllSupabaseRecords() {
  if (!window.supabaseClient) {
    console.error("Supabase client غير موجود");
    return [];
  }

  try {
    const result = await window.supabaseClient
      .from("records")
      .select("*")
      .order("id", { ascending: false });

    if (result.error) {
      console.error("Supabase SELECT Error:", result.error);
      return [];
    }

    return (result.data || []).map(normalizeRecord).filter(Boolean);
  } catch (error) {
    console.error("Supabase Connection Error:", error);
    return [];
  }
}

async function getDepartmentRecordsFromSupabase(storageName) {
  const department = getDepartmentFromStorage(storageName);
  if (!window.supabaseClient) return [];

  try {
    const result = await window.supabaseClient
      .from("records")
      .select("*")
      .eq("department", department)
      .order("id", { ascending: false });

    if (result.error) {
      console.error("Supabase Department Error:", result.error);
      return [];
    }

    return (result.data || []).map(normalizeRecord).filter(Boolean);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// ============================================================
// SUPABASE SAVE
// ============================================================

async function saveRecordToSupabase(department, data) {
  if (!window.supabaseClient) {
    alert("❌ Supabase غير متصل");
    return null;
  }

  if (!department) {
    alert("❌ اسم القسم غير موجود");
    return null;
  }

  const user = getCurrentUser();
  const done = data.done || "";

  const payload = {
    department: String(department),
    car_name: data.carName || "",
    car_number: data.carNumber || "",
    device: data.device || "",
    socket: data.socket || "",
    done: done,
    notes: data.notes || "",
    person: data.person || "",
    created_by: data.addedBy || data.createdBy || (user ? user.name : "Unknown")
  };

  // Existing schema already contains not_completed_reason.
  if (done === "لا") {
    payload.not_completed_reason = makeProblemMeta(
      data.notCompletedReason || data.problemReason || data.notes || "",
      "open",
      "",
      "",
      "",
      ""
    );
  } else if (data.notCompletedReason) {
    payload.not_completed_reason = data.notCompletedReason;
  }

  try {
    const result = await window.supabaseClient
      .from("records")
      .insert(payload)
      .select()
      .single();

    if (result.error) {
      console.error("Supabase INSERT Error:", result.error);
      alert("❌ تعذر حفظ البيانات\n\n" + result.error.message);
      return null;
    }

    return normalizeRecord(result.data);
  } catch (error) {
    console.error("Supabase Connection Error:", error);
    alert("❌ حدث خطأ أثناء الاتصال بـ Supabase");
    return null;
  }
}

async function deleteRecordFromSupabase(recordId) {
  if (!window.supabaseClient) {
    alert("❌ Supabase غير متصل");
    return false;
  }

  try {
    const result = await window.supabaseClient
      .from("records")
      .delete()
      .eq("id", recordId);

    if (result.error) {
      console.error("Supabase DELETE Error:", result.error);
      alert("❌ تعذر حذف السجل\n\n" + result.error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// ============================================================
// PROBLEM WORKFLOW
// ============================================================

function getVisibleProblemRecords(records, user = getCurrentUser()) {
  let list = (records || []).filter(isProblemRecord);
  if (!user || user.role === "admin") return list;
  return list.filter(r => r.department === user.role);
}

async function getProblemRecordsForCurrentUser() {
  const user = getCurrentUser();
  if (!user) return [];
  const records = await getAllSupabaseRecords();
  return getVisibleProblemRecords(records, user);
}

async function getProblemsCountForCurrentUser() {
  return (await getProblemRecordsForCurrentUser()).length;
}

async function getPendingReviewProblems() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return [];
  const records = await getAllSupabaseRecords();
  return records.filter(isProblemPendingReview);
}

async function updateProblemMeta(recordId, meta) {
  if (!window.supabaseClient) return false;

  const result = await window.supabaseClient
    .from("records")
    .update({
      not_completed_reason: makeProblemMeta(
        meta.reason,
        meta.status,
        meta.resolvedBy,
        meta.resolvedAt,
        meta.reviewedBy,
        meta.reviewedAt
      )
    })
    .eq("id", recordId);

  if (result.error) {
    console.error("Problem update error:", result.error);
    alert("❌ تعذر تحديث حالة المشكلة\n\n" + result.error.message);
    return false;
  }

  return true;
}

async function resolveProblem(recordId, reason) {
  const user = getCurrentUser();
  if (!user) return false;

  const cleanReason = String(reason || "").trim();
  if (!cleanReason) {
    alert("من فضلك اكتب سبب/تفاصيل إتمام حل المشكلة");
    return false;
  }

  const records = await getAllSupabaseRecords();
  const record = records.find(r => String(r.recordId) === String(recordId));
  if (!record || !isProblemRecord(record)) {
    alert("❌ المشكلة غير موجودة أو تم التعامل معها بالفعل");
    return false;
  }

  if (user.role !== "admin" && record.department !== user.role) {
    alert("❌ ليس لديك صلاحية لتعديل هذه المشكلة");
    return false;
  }

  const meta = readProblemMeta(record.notCompletedReason);
  const ok = await updateProblemMeta(recordId, {
    reason: cleanReason,
    status: "pending_review",
    resolvedBy: user.name,
    resolvedAt: new Date().toISOString(),
    reviewedBy: meta?.reviewedBy || "",
    reviewedAt: meta?.reviewedAt || ""
  });

  if (ok) {
    await refreshProblemsUI();
    await updateDashboardStats();
    alert("✅ تم تسجيل حل المشكلة وهي الآن في انتظار مراجعة المدير");
  }

  return ok;
}

async function approveResolvedProblem(recordId) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    alert("❌ اعتماد حل المشكلة متاح للمدير فقط");
    return false;
  }

  const records = await getAllSupabaseRecords();
  const record = records.find(r => String(r.recordId) === String(recordId));
  if (!record || !isProblemPendingReview(record)) {
    alert("❌ هذه المشكلة ليست في انتظار مراجعة المدير");
    return false;
  }

  const meta = readProblemMeta(record.notCompletedReason);
  if (!window.supabaseClient) return false;

  // After manager approval, Done becomes نعم and the problem disappears
  // from active problems while its history remains in the record.
  const result = await window.supabaseClient
    .from("records")
    .update({
      done: "نعم",
      not_completed_reason: makeProblemMeta(
        meta?.reason || record.problemReason || "",
        "resolved",
        meta?.resolvedBy || "",
        meta?.resolvedAt || "",
        user.name,
        new Date().toISOString()
      )
    })
    .eq("id", recordId);

  if (result.error) {
    console.error("Approve problem error:", result.error);
    alert("❌ تعذر اعتماد المشكلة\n\n" + result.error.message);
    return false;
  }

  await refreshProblemsUI();
  await updateDashboardStats();
  alert("✅ تم اعتماد حل المشكلة");
  return true;
}

async function rejectResolvedProblem(recordId, reason) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    alert("❌ رفض حل المشكلة متاح للمدير فقط");
    return false;
  }

  const records = await getAllSupabaseRecords();
  const record = records.find(r => String(r.recordId) === String(recordId));
  if (!record || !isProblemPendingReview(record)) {
    alert("❌ المشكلة ليست في انتظار المراجعة");
    return false;
  }

  const meta = readProblemMeta(record.notCompletedReason);
  const cleanReason = String(reason || "").trim() || "لم يتم اعتماد الحل";

  const ok = await updateProblemMeta(recordId, {
    reason: cleanReason,
    status: "open",
    resolvedBy: "",
    resolvedAt: "",
    reviewedBy: user.name,
    reviewedAt: new Date().toISOString()
  });

  if (ok) {
    await refreshProblemsUI();
    await updateDashboardStats();
    alert("↩️ تم إرجاع المشكلة للعامل لمتابعتها مرة أخرى");
  }

  return ok;
}

function askResolveProblem(recordId) {
  const reason = prompt("اكتب تفاصيل حل المشكلة أو ما تم عمله:");
  if (reason === null) return;
  resolveProblem(recordId, reason);
}

function askRejectResolvedProblem(recordId) {
  const reason = prompt("اكتب سبب رفض الحل:");
  if (reason === null) return;
  rejectResolvedProblem(recordId, reason);
}

// ============================================================
// PROBLEMS PAGE UI
// ============================================================

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatArabicDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHTML(value);
  return date.toLocaleString("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function toggleProblemDevice(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("show");
}

function renderProblemDetails(record) {
  const status = getProblemStatus(record);
  const reason = getProblemReason(record);

  let actions = "";
  if (status === "open") {
    actions = `
      <button class="pending-button" onclick="askResolveProblem('${escapeHTML(record.recordId)}')">
        ✅ تم حل المشكلة
      </button>
    `;
  } else if (status === "pending_review") {
    actions = `
      <div class="info-box">
        ⏳ في انتظار مراجعة المدير
        <br>
        <small>تم تسجيل الحل بواسطة: ${escapeHTML(record.problemResolvedBy || "-")}</small>
        <br>
        <small>وقت الحل: ${formatArabicDate(record.problemResolvedAt)}</small>
      </div>
    `;
    if (getCurrentUser()?.role === "admin") {
      actions += `
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="pending-button" onclick="approveResolvedProblem('${escapeHTML(record.recordId)}')">
            ✅ اعتماد الحل
          </button>
          <button class="pending-button" onclick="askRejectResolvedProblem('${escapeHTML(record.recordId)}')">
            ↩️ رفض وإرجاع المشكلة
          </button>
        </div>
      `;
    }
  }

  return `
    <div class="pending-details">
      <p><strong>المشكلة:</strong> ${escapeHTML(reason || "لم يتم كتابة سبب")}</p>
      <p><strong>الجهاز:</strong> ${escapeHTML(record.device || "-")}</p>
      <p><strong>مين سجلها:</strong> ${escapeHTML(record.addedBy || record.person || "-")}</p>
      <p><strong>الوقت والتاريخ:</strong> ${formatArabicDate(record.date)}</p>
      ${record.socket ? `<p><strong>Socket:</strong> ${escapeHTML(record.socket)}</p>` : ""}
      ${record.notes && record.notes !== reason ? `<p><strong>ملاحظات:</strong> ${escapeHTML(record.notes)}</p>` : ""}
      ${actions}
    </div>
  `;
}

function renderProblemDepartment(department, records) {
  const groups = {};

  records.forEach(record => {
    const key = record.device || "مشكلة بدون اسم جهاز";
    if (!groups[key]) groups[key] = [];
    groups[key].push(record);
  });

  const devices = Object.keys(groups);

  if (!devices.length) {
    return `
      <section class="work-box">
        <h2 class="work-title">${escapeHTML(departmentNames[department] || department)}</h2>
        <div class="no-records-box">لا توجد مشاكل في هذا القسم لهذه العربية</div>
      </section>
    `;
  }

  return `
    <section class="work-box">
      <h2 class="work-title">${escapeHTML(departmentNames[department] || department)}</h2>
      <div class="pending-list">
        ${devices.map((device, index) => {
          const id = `problem_${department}_${index}_${Date.now()}`;
          return `
            <div class="pending-item">
              <button class="pending-button" onclick="toggleProblemDevice('${id}')">
                ⚠️ ${escapeHTML(device)}
                <span>(${groups[device].length})</span>
              </button>
              <div id="${id}" class="pending-details">
                ${groups[device].map(renderProblemDetails).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

async function loadProblemsPage() {
  const user = getCurrentUser();
  const carSelect =
    document.getElementById("problemCarNumber") ||
    document.getElementById("searchCarNumber");

  const result =
    document.getElementById("problemsResult") ||
    document.getElementById("searchResult");

  if (!result) return;

  if (!user) {
    result.innerHTML = `<div class="error">❌ يجب تسجيل الدخول أولاً</div>`;
    return;
  }

  const records = await getVisibleProblemRecords(
    await getAllSupabaseRecords(),
    user
  );

  if (!carSelect) {
    renderProblemsForCar("", records, result);
    return;
  }

  const carNumber = carSelect.value.trim();
  if (!carNumber) {
    result.innerHTML = `
      <div class="info-box">
        اختر رقم العربية أولاً لعرض المشاكل المسجلة عليها.
      </div>
    `;
    return;
  }

  renderProblemsForCar(carNumber, records, result);
}

function renderProblemsForCar(carNumber, records, result) {
  const carRecords = records.filter(r => r.carNumber === carNumber);

  if (!carRecords.length) {
    result.innerHTML = `
      <div class="no-records-box">
        لا توجد مشاكل مسجلة للعربية ${escapeHTML(carNumber)}
      </div>
    `;
    return;
  }

  const departments = {};
  carRecords.forEach(record => {
    if (!departments[record.department]) departments[record.department] = [];
    departments[record.department].push(record);
  });

  result.innerHTML = `
    <div class="search-title">
      <h2>⚠️ مشاكل العربية رقم ${escapeHTML(carNumber)}</h2>
      <p>إجمالي المشاكل: ${carRecords.length}</p>
    </div>
    ${Object.keys(departments).map(
      dept => renderProblemDepartment(dept, departments[dept])
    ).join("")}
  `;
}

async function refreshProblemsUI() {
  if (getCurrentPage() !== "problems.html") return;
  await loadProblemsPage();
}

// Fill any car-number select used by the problems page.
async function loadProblemCarNumbers() {
  const select =
    document.getElementById("problemCarNumber") ||
    document.getElementById("searchCarNumber");

  if (!select || !window.supabaseClient) return;

  try {
    const result = await window.supabaseClient
      .from("records")
      .select("car_number")
      .order("car_number", { ascending: true });

    if (result.error) {
      console.error(result.error);
      return;
    }

    const values = [...new Set(
      (result.data || [])
        .map(r => r.car_number)
        .filter(Boolean)
    )];

    const current = select.value;
    select.innerHTML = `<option value="">اختر رقم العربية</option>`;
    values.forEach(number => {
      const option = document.createElement("option");
      option.value = number;
      option.textContent = number;
      select.appendChild(option);
    });
    if (values.includes(current)) select.value = current;
  } catch (error) {
    console.error(error);
  }
}

// ============================================================
// GENERIC RECORD DISPLAY
// ============================================================

function clearInput(id) {
  const element = document.getElementById(id);
  if (element) {
    if (element.tagName === "SELECT") element.selectedIndex = 0;
    else element.value = "";
  }
}

async function displayDepartmentRecords(storageName, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const records = await getDepartmentRecordsFromSupabase(storageName);

  if (!records.length) {
    container.innerHTML = `
      <div class="no-records-box">لا توجد بيانات مسجلة حتى الآن</div>
    `;
    return;
  }

  container.innerHTML = records.map(record => `
    <div class="registered-box">
      <h3>${escapeHTML(record.device || record.carName || "سجل")}</h3>
      <p><strong>رقم العربية:</strong> ${escapeHTML(record.carNumber)}</p>
      <p><strong>الحالة:</strong> ${escapeHTML(record.done || "-")}</p>
      ${record.done === "لا" ? `<p class="reason"><strong>السبب:</strong> ${escapeHTML(getProblemReason(record))}</p>` : ""}
      <p><strong>الملاحظات:</strong> ${escapeHTML(record.notes || "لا يوجد")}</p>
      <p><strong>المستخدم:</strong> ${escapeHTML(record.addedBy || "-")}</p>
    </div>
  `).join("");
}

async function displayWiringRecords() {
  await displayDepartmentRecords("wiringRecords", "wiringRecords");
}

async function displayLTRecords() {
  await displayDepartmentRecords("ltRecords", "ltRecords");
}

async function displayHTRecords() {
  await displayDepartmentRecords("htRecords", "htRecords");
}

async function displayInstallationRecords() {
  await displayDepartmentRecords("installationRecords", "installationRecords");
}

async function displayFinalRecords() {
  await displayDepartmentRecords("finalRecords", "finalRecords");
}

async function displayAllRecords() {
  const map = {
    wiringRecords: "wiringRecords",
    ltRecords: "ltRecords",
    htRecords: "htRecords",
    installationRecords: "installationRecords",
    finalRecords: "finalRecords"
  };

  for (const [storageName, containerId] of Object.entries(map)) {
    if (document.getElementById(containerId)) {
      await displayDepartmentRecords(storageName, containerId);
    }
  }
}

// ============================================================
// SAVE FUNCTIONS - compatible with existing page IDs
// ============================================================

async function saveWiring() {
  const carName = document.getElementById("wiringCarName")?.value.trim();
  const carNumber = document.getElementById("wiringCarNumber")?.value.trim();
  const device = document.getElementById("wiringDevice")?.value.trim();
  const socket = document.getElementById("wiringSocket")?.value.trim();
  const done = document.getElementById("wiringDone")?.value || "نعم";
  const notes = document.getElementById("wiringNotes")?.value.trim();
  const message = document.getElementById("wiringMessage");

  if (!carName || !carNumber) {
    if (message) message.innerText = "من فضلك املأ البيانات المطلوبة";
    return;
  }

  const saved = await saveRecordToSupabase("wiring", {
    carName, carNumber, device, socket, done, notes,
    addedBy: getCurrentUser()?.name || "Unknown"
  });

  if (saved) {
    if (message) message.innerText = "✅ تم حفظ البيانات بنجاح";
    clearInput("wiringDevice");
    clearInput("wiringSocket");
    clearInput("wiringDone");
    clearInput("wiringNotes");
    await displayWiringRecords();
    await updateDashboardStats();
  }
  return saved;
}

async function saveLT() {
  const carName = document.getElementById("ltCarName")?.value.trim();
  const carNumber = document.getElementById("ltCarNumber")?.value.trim();
  const device = document.getElementById("ltDevice")?.value.trim();
  const socket = document.getElementById("ltSocket")?.value.trim();
  const notes = document.getElementById("ltNotes")?.value.trim();
  const done = document.getElementById("ltDone")?.value || "نعم";
  const reason =
    document.getElementById("ltNotCompletedReason")?.value.trim() ||
    document.getElementById("ltReason")?.value.trim() ||
    "";

  const message = document.getElementById("ltMessage");

  if (!carName || !carNumber || !device || !socket) {
    if (message) message.innerText = "من فضلك املأ البيانات المطلوبة";
    return;
  }

  const saved = await saveRecordToSupabase("lt", {
    carName, carNumber, device, socket, notes, done,
    notCompletedReason: reason,
    addedBy: getCurrentUser()?.name || "Unknown"
  });

  if (saved) {
    if (message) message.innerText = "✅ تم حفظ البيانات بنجاح";
    clearInput("ltDevice");
    clearInput("ltSocket");
    clearInput("ltDone");
    clearInput("ltNotCompletedReason");
    clearInput("ltReason");
    clearInput("ltNotes");
    await displayLTRecords();
    await updateDashboardStats();
  }
  return saved;
}

async function saveHT() {
  const carName = document.getElementById("htCarName")?.value.trim();
  const carNumber = document.getElementById("htCarNumber")?.value.trim();
  const device = document.getElementById("htDevice")?.value.trim();
  const socket = document.getElementById("htSocket")?.value.trim();
  const done = document.getElementById("htDone")?.value;
  const notes = document.getElementById("htNotes")?.value.trim();
  const reason =
    document.getElementById("htNotCompletedReason")?.value.trim() ||
    document.getElementById("htReason")?.value.trim() ||
    "";

  const message = document.getElementById("htMessage");

  if (!carName || !carNumber || !done) {
    if (message) message.innerText = "من فضلك املأ البيانات المطلوبة";
    return;
  }

  const saved = await saveRecordToSupabase("ht", {
    carName, carNumber, device, socket, done, notes,
    notCompletedReason: reason,
    addedBy: getCurrentUser()?.name || "Unknown"
  });

  if (saved) {
    if (message) message.innerText = "✅ تم حفظ البيانات بنجاح";
    clearInput("htDevice");
    clearInput("htSocket");
    clearInput("htDone");
    clearInput("htNotCompletedReason");
    clearInput("htReason");
    clearInput("htNotes");
    await displayHTRecords();
    await updateDashboardStats();
  }
  return saved;
}

async function saveInstallation() {
  const carName = document.getElementById("installationCarName")?.value.trim();
  const carNumber = document.getElementById("installationCarNumber")?.value.trim();
  const device = document.getElementById("installationDevice")?.value.trim();
  const socket = document.getElementById("installationSocket")?.value.trim();
  const done = document.getElementById("installationDone")?.value;
  const notes = document.getElementById("installationNotes")?.value.trim();
  const reason =
    document.getElementById("installationNotCompletedReason")?.value.trim() ||
    document.getElementById("installationReason")?.value.trim() ||
    "";

  const message = document.getElementById("installationMessage");

  if (!carName || !carNumber || !done) {
    if (message) message.innerText = "من فضلك املأ البيانات المطلوبة";
    return;
  }

  const saved = await saveRecordToSupabase("installation", {
    carName, carNumber, device, socket, done, notes,
    notCompletedReason: reason,
    addedBy: getCurrentUser()?.name || "Unknown"
  });

  if (saved) {
    if (message) message.innerText = "✅ تم حفظ البيانات بنجاح";
    clearInput("installationDevice");
    clearInput("installationSocket");
    clearInput("installationDone");
    clearInput("installationNotCompletedReason");
    clearInput("installationReason");
    clearInput("installationNotes");
    await displayInstallationRecords();
    await updateDashboardStats();
  }
  return saved;
}

async function saveFinal() {
  const carName = document.getElementById("finalCarName")?.value.trim();
  const carNumber = document.getElementById("finalCarNumber")?.value.trim();
  const device = document.getElementById("finalDevice")?.value.trim();
  const socket = document.getElementById("finalSocket")?.value.trim();
  const done = document.getElementById("finalDone")?.value || "نعم";
  const notes = document.getElementById("finalNotes")?.value.trim();
  const message = document.getElementById("finalMessage");

  if (!carName || !carNumber) {
    if (message) message.innerText = "من فضلك املأ البيانات المطلوبة";
    return;
  }

  const saved = await saveRecordToSupabase("final", {
    carName, carNumber, device, socket, done, notes,
    addedBy: getCurrentUser()?.name || "Unknown"
  });

  if (saved) {
    if (message) message.innerText = "✅ تم حفظ البيانات بنجاح";
    clearInput("finalDevice");
    clearInput("finalSocket");
    clearInput("finalDone");
    clearInput("finalNotes");
    await displayFinalRecords();
    await updateDashboardStats();
  }
  return saved;
}

// ============================================================
// DASHBOARD STATS
// ============================================================

async function updateDashboardStats() {
  const elements = {
    total: document.getElementById("totalRecords"),
    completed: document.getElementById("completedRecords"),
    pending: document.getElementById("pendingRecords"),
    delayed: document.getElementById("delayedRecords"),
    today: document.getElementById("todayRecords"),
    problems: document.getElementById("problemRecords"),
    review: document.getElementById("problemReviewCount")
  };

  const records = await getAllSupabaseRecords();
  const user = getCurrentUser();
  if (!user) return;

  const completed = records.filter(r => r.done === "نعم").length;
  const pending = records.filter(r => r.done === "لا").length;

  const visibleProblems = getVisibleProblemRecords(records, user).length;
  const reviewCount = user.role === "admin"
    ? records.filter(isProblemPendingReview).length
    : 0;

  const today = new Date().toLocaleDateString("en-CA");
  const todayCount = records.filter(record => {
    if (!record.date) return false;
    const date = new Date(record.date);
    return !Number.isNaN(date.getTime()) &&
      date.toLocaleDateString("en-CA") === today;
  }).length;

  if (elements.total) elements.total.innerText = records.length;
  if (elements.completed) elements.completed.innerText = completed;
  if (elements.pending) elements.pending.innerText = pending;
  if (elements.delayed) elements.delayed.innerText = 0;
  if (elements.today) elements.today.innerText = todayCount;
  if (elements.problems) elements.problems.innerText = visibleProblems;
  if (elements.review) elements.review.innerText = reviewCount;

  const reviewMenu = document.getElementById("resolvedProblemsMenu");
  if (reviewMenu) reviewMenu.style.display = user.role === "admin" ? "" : "none";
}

// ============================================================
// DELETE REQUESTS
// ============================================================

async function displayDeleteRequests() {
  const container = document.getElementById("deleteRequests");
  if (!container) return;

  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    container.innerHTML = `<div class="error">❌ هذه الصفحة متاحة للمدير فقط</div>`;
    return;
  }

  const requests = await getDeleteRequestsData();

  if (!requests.length) {
    container.innerHTML = `<div class="no-records-box">لا توجد طلبات حذف</div>`;
    return;
  }

  container.innerHTML = requests.map(request => `
    <div class="registered-box">
      <h3>طلب حذف</h3>
      <p><strong>السجل:</strong> ${escapeHTML(request.record_id || "-")}</p>
      <p><strong>بواسطة:</strong> ${escapeHTML(request.requested_by || "-")}</p>
      <p><strong>السبب:</strong> ${escapeHTML(request.reason || "-")}</p>
      <button class="pending-button" onclick="approveDeleteRequest('${escapeHTML(request.id)}','${escapeHTML(request.record_id)}')">
        🗑️ الموافقة على الحذف
      </button>
    </div>
  `).join("");
}

async function getDeleteRequestsData() {
  if (!window.supabaseClient) return [];

  try {
    const result = await window.supabaseClient
      .from("delete_requests")
      .select("*")
      .order("id", { ascending: false });

    if (result.error) {
      console.error(result.error);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function updateDeleteRequestsCount() {
  const element =
    document.getElementById("deleteRequestsCount") ||
    document.getElementById("deleteRequestsBadge");

  if (!element) return;

  const user = getCurrentUser();

  if (!user || user.role !== "admin") {
    element.style.display = "none";
    return;
  }

  try {
    // كل طلبات الحذف الموجودة
    const requests = await getDeleteRequestsData();

    // كل السجلات الموجودة حاليًا في records
    const records = await getAllSupabaseRecords();

    // أرقام السجلات الموجودة حاليًا
    const existingRecordIds = new Set(
      records.map(record => String(record.recordId))
    );

    // نحسب فقط الطلبات التي تخص سجلات ما زالت موجودة
    const pendingRequests = requests.filter(request =>
      existingRecordIds.has(String(request.record_id))
    );

    const count = pendingRequests.length;

    element.innerText = count;
    element.style.display = count > 0 ? "" : "none";

  } catch (error) {
    console.error("Delete requests count error:", error);
  }
}
async function requestDelete(recordId, reason = "") {
  const user = getCurrentUser();
  if (!user) return false;

  if (!window.supabaseClient) {
    alert("❌ Supabase غير متصل");
    return false;
  }

  const cleanReason = String(reason || "").trim() || "بدون سبب";

  try {
    const result = await window.supabaseClient
      .from("delete_requests")
      .insert({
        record_id: recordId,
        requested_by: user.name,
        reason: cleanReason
      });

    if (result.error) {
      console.error(result.error);
      alert("❌ تعذر إرسال طلب الحذف\n\n" + result.error.message);
      return false;
    }

    alert("✅ تم إرسال طلب الحذف إلى المدير");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function approveDeleteRequest(requestId, recordId) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    alert("❌ الموافقة على الحذف متاحة للمدير فقط");
    return false;
  }

  const deleted = await deleteRecordFromSupabase(recordId);
  if (!deleted) return false;

  try {
    const result = await window.supabaseClient
      .from("delete_requests")
      .delete()
      .eq("id", requestId);

    if (result.error) {
      console.error(result.error);
      return false;
    }

    await displayDeleteRequests();
    await updateDeleteRequestsCount();
    await displayAllRecords();
    await updateDashboardStats();
    alert("✅ تم حذف السجل والموافقة على الطلب");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// ============================================================
// SEARCH - compatible with existing search page
// ============================================================

async function searchCar() {
  const input = document.getElementById("searchCarNumber");
  const result = document.getElementById("searchResult");
  if (!input || !result) return;

  const number = input.value.trim();
  if (!number) {
    result.innerHTML = `<div class="error">من فضلك اكتب رقم العربية</div>`;
    return;
  }

  const records = (await getAllSupabaseRecords()).filter(
    record => record.carNumber === number
  );

  if (!records.length) {
    result.innerHTML = `
      <div class="search-title">
        <h2>بيانات العربية رقم ${escapeHTML(number)}</h2>
      </div>
      <div class="no-car">لا توجد بيانات لهذه العربية</div>
    `;
    return;
  }

  const departments = {
    wiring: "🔌 قسم Wiring",
    lt: "⚡ قسم LT",
    ht: "🔧 قسم HT",
    installation: "🛠️ قسم التركيبات",
    final: "✅ قسم الفنش النهائي"
  };

  result.innerHTML = `
    <div class="search-title">
      <h2>بيانات العربية رقم ${escapeHTML(number)}</h2>
    </div>
  `;

  Object.keys(departments).forEach(department => {
    const departmentRecords = records.filter(
      record => record.department === department
    );

    result.innerHTML += `
      <div class="department-result ${departmentRecords.length ? "" : "no-data"}">
        <h2>${departments[department]}</h2>
        ${
          departmentRecords.length
            ? departmentRecords.map(record => `
              <div class="registered-box">
                <h3>${escapeHTML(record.device || "سجل")}</h3>
                <p><strong>رقم العربية:</strong> ${escapeHTML(record.carNumber)}</p>
                <p><strong>الحالة:</strong> ${escapeHTML(record.done || "-")}</p>
                ${
                  record.done === "لا"
                    ? `<p class="reason"><strong>السبب:</strong> ${escapeHTML(getProblemReason(record))}</p>`
                    : ""
                }
                <p><strong>الملاحظات:</strong> ${escapeHTML(record.notes || "لا يوجد")}</p>
                <p><strong>المستخدم:</strong> ${escapeHTML(record.addedBy || "-")}</p>
              </div>
            `).join("")
            : `<div class="no-car">لا توجد بيانات لهذه العربية في هذا القسم</div>`
        }
      </div>
    `;
  });
}

// ============================================================
// CAR NUMBER HELPER
// ============================================================

function calculateCarNumber(carName, unit) {
  const positions = { DTC: 0, MC1: 1, MC2: 2, MCI: 3 };
  const name = String(carName || "").trim().toUpperCase();
  const number = Number(unit);

  if (!Object.prototype.hasOwnProperty.call(positions, name) || number < 17) {
    return "";
  }

  const baseNumber = 65 + ((number - 17) * 4);
  return `${baseNumber + positions[name]}-${name}-${number}`;
}

// ============================================================
// PROBLEMS PAGE INITIALIZATION
// ============================================================

function setupProblemsPage() {
  const select =
    document.getElementById("problemCarNumber") ||
    document.getElementById("searchCarNumber");

  if (select) {
    select.addEventListener("change", loadProblemsPage);
  }

  const button = document.getElementById("problemSearchButton");
  if (button) {
    button.addEventListener("click", loadProblemsPage);
  }

  loadProblemCarNumbers();
  loadProblemsPage();
}

// ============================================================
// INITIALIZATION
// ============================================================

async function initializeSystem() {
  protectPage();

  setupDashboard();

  const currentPage = getCurrentPage();

  if (currentPage === "problems.html") {
    setupProblemsPage();
  }

  if (currentPage !== "login.html") {
    await displayAllRecords();
    await updateDashboardStats();
    await displayDeleteRequests();
    await updateDeleteRequestsCount();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSystem);
} else {
  initializeSystem();
}

// ============================================================
// AUTO REFRESH
// ============================================================

setInterval(async function() {
  const currentPage = getCurrentPage();
  if (currentPage === "login.html") return;

  await updateDeleteRequestsCount();
  await displayDeleteRequests();
  await updateDashboardStats();

  if (currentPage === "problems.html") {
    await loadProblemsPage();
  } else {
    await displayAllRecords();
  }
}, 3000);

// ============================================================
// LOGOUT
// ============================================================

function logout() {
  sessionStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
