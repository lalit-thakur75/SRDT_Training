// ========================================================
// Training Management System - Frontend App Logic (app.js)
// ========================================================

const API_BASE = "http://localhost:8000/api";
const UPLOAD_BASE = "http://localhost:8000";

let currentUser = null;
let currentToken = null;
let allTracks = [];
let allSchedules = [];
let allMaterials = [];

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
    checkAuthSession();
    fetchSystemStatus();
    loadDashboardStats();
    loadTracks();
    loadSchedules();
    loadMaterials();
    setupEventListeners();
});

// --- Auth Session Handling ---
function checkAuthSession() {
    const savedUser = localStorage.getItem("tms_user");
    const savedToken = localStorage.getItem("tms_token");

    if (savedUser && savedToken) {
        currentUser = JSON.parse(savedUser);
        currentToken = savedToken;
        updateUserUI();
    } else {
        updateUserUI();
    }
}

function updateUserUI() {
    const userDisplay = document.getElementById("header-user-display");
    const authButtons = document.getElementById("header-auth-buttons");
    const adminNavTab = document.getElementById("nav-admin-tab");
    const trainerNavTab = document.getElementById("nav-trainer-tab");
    const studentNavTab = document.getElementById("nav-student-tab");
    const adminAddScheduleBtn = document.getElementById("btn-add-schedule-trigger");

    if (currentUser) {
        userDisplay.style.display = "flex";
        userDisplay.innerHTML = `
            <span>👤</span>
            <span>Hi, <strong>${currentUser.name}</strong> (${currentUser.role.toUpperCase()})</span>
            ${currentUser.roll_no ? `<span class="badge badge-track">${currentUser.roll_no}</span>` : ""}
        `;
        authButtons.innerHTML = `
            <button class="btn btn-outline-white btn-sm" onclick="logout()">Logout</button>
        `;

        // Role-based navigation visibility
        if (adminNavTab) adminNavTab.style.display = currentUser.role === "admin" ? "inline-flex" : "none";
        if (trainerNavTab) trainerNavTab.style.display = (currentUser.role === "trainer" || currentUser.role === "admin") ? "inline-flex" : "none";
        if (studentNavTab) studentNavTab.style.display = "inline-flex";
        if (adminAddScheduleBtn) adminAddScheduleBtn.style.display = currentUser.role === "admin" ? "inline-flex" : "none";

        // Load role-specific data if applicable
        if (currentUser.role === "admin") {
            loadAdminData();
        } else if (currentUser.role === "trainer") {
            loadTrainerData();
        } else if (currentUser.role === "student") {
            loadStudentData();
        }
    } else {
        userDisplay.style.display = "none";
        authButtons.innerHTML = `
            <button class="btn btn-outline-white btn-sm" onclick="openModal('modal-login')">Login</button>
            <button class="btn btn-primary btn-sm" onclick="openModal('modal-register')">Student Sign Up</button>
        `;
        if (adminNavTab) adminNavTab.style.display = "none";
        if (trainerNavTab) trainerNavTab.style.display = "none";
        if (studentNavTab) studentNavTab.style.display = "none";
        if (adminAddScheduleBtn) adminAddScheduleBtn.style.display = "none";
    }
}

// --- Check Backend Connection ---
async function fetchSystemStatus() {
    const statusText = document.getElementById("system-status-text");
    const statusDot = document.getElementById("system-status-dot");

    try {
        const res = await fetch(`${API_BASE}/stats`);
        if (res.ok) {
            statusText.innerText = "System Online (FastAPI + DB)";
            statusDot.style.backgroundColor = "var(--success)";
        } else {
            statusText.innerText = "Backend Connecting...";
            statusDot.style.backgroundColor = "var(--warning)";
        }
    } catch (err) {
        statusText.innerText = "Demo Local Mode (Offline)";
        statusDot.style.backgroundColor = "var(--warning)";
    }
}

// --- Navigation Tabs ---
function switchTab(tabId) {
    document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(el => el.style.display = "none");

    const targetLink = document.getElementById(`nav-${tabId}`);
    if (targetLink) targetLink.classList.add("active");

    const targetSection = document.getElementById(`section-${tabId}`);
    if (targetSection) targetSection.style.display = "block";

    // Trigger tab specific refresh
    if (tabId === "schedules") loadSchedules();
    if (tabId === "materials") loadMaterials();
    if (tabId === "admin" && currentUser?.role === "admin") loadAdminData();
    if (tabId === "trainer" && (currentUser?.role === "trainer" || currentUser?.role === "admin")) loadTrainerData();
    if (tabId === "student") loadStudentData();
}

// --- Load Stats & Tracks ---
async function loadDashboardStats() {
    try {
        const res = await fetch(`${API_BASE}/stats`);
        if (!res.ok) return;
        const data = await res.json();

        document.getElementById("stat-tracks").innerText = String(data.total_tracks).padStart(2, "0");
        document.getElementById("stat-sessions").innerText = String(data.total_sessions).padStart(2, "0");
        document.getElementById("stat-students").innerText = String(data.total_students).padStart(2, "0");
        document.getElementById("stat-materials").innerText = String(data.total_materials).padStart(2, "0");
    } catch (e) {
        console.warn("Could not load stats from backend", e);
    }
}

async function loadTracks() {
    try {
        const res = await fetch(`${API_BASE}/tracks`);
        if (!res.ok) return;
        allTracks = await res.json();

        // Populate track selectors in forms
        const scheduleTrackSelect = document.getElementById("schedule-track-select");
        const materialTrackSelect = document.getElementById("material-track-select");
        const filterTrackSelect = document.getElementById("filter-track-select");
        const trainerTrackSelect = document.getElementById("trainer-track-select");
        const eligibleTrackSelect = document.getElementById("eligible-track-select");

        const optionsHtml = allTracks.map(t => `<option value="${t.id}">${t.name}</option>`).join("");

        if (scheduleTrackSelect) scheduleTrackSelect.innerHTML = optionsHtml;
        if (materialTrackSelect) materialTrackSelect.innerHTML = optionsHtml;
        if (trainerTrackSelect) trainerTrackSelect.innerHTML = optionsHtml;
        if (eligibleTrackSelect) eligibleTrackSelect.innerHTML = optionsHtml;
        if (filterTrackSelect) {
            filterTrackSelect.innerHTML = `<option value="">All Tracks</option>` + optionsHtml;
        }

        renderTracksGrid(allTracks);
    } catch (e) {
        console.warn("Could not load tracks", e);
    }
}

function renderTracksGrid(tracks) {
    const container = document.getElementById("tracks-container");
    if (!container) return;

    if (!tracks || tracks.length === 0) {
        container.innerHTML = `<p class="section-desc">No tracks found.</p>`;
        return;
    }

    container.innerHTML = tracks.map((t, idx) => `
        <div class="track-card ${idx % 2 === 1 ? 'ai-track' : ''}">
            <span class="badge badge-track">Track 0${idx + 1}</span>
            <h3 style="margin-top: 10px;">${t.name}</h3>
            <p>${t.description || 'Full comprehensive training curriculum.'}</p>
            <div class="track-meta">
                <span>🗓️ ${t.session_count || 0} Sessions</span>
                <span>👨‍🎓 ${t.student_count || 0} Trainees</span>
            </div>
        </div>
    `).join("");
}

// --- Schedules Management ---
async function loadSchedules() {
    const trackFilter = document.getElementById("filter-track-select")?.value || "";
    const modeFilter = document.getElementById("filter-mode-select")?.value || "";

    let url = `${API_BASE}/schedules`;
    const params = [];
    if (trackFilter) params.push(`track_id=${trackFilter}`);
    if (modeFilter) params.push(`mode=${modeFilter}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return;
        allSchedules = await res.json();
        renderSchedules(allSchedules);
    } catch (e) {
        console.warn("Could not load schedules", e);
    }
}

function renderSchedules(schedules) {
    const container = document.getElementById("schedules-list-container");
    if (!container) return;

    if (!schedules || schedules.length === 0) {
        container.innerHTML = `
            <div class="stat-card" style="text-align: center; padding: 30px;">
                <p>No training sessions scheduled yet.</p>
                ${currentUser?.role === 'admin' ? '<button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="openAddScheduleModal()">+ Schedule First Class</button>' : ''}
            </div>
        `;
        return;
    }

    container.innerHTML = schedules.map(s => {
        const isOnline = s.mode.toLowerCase() === "online";
        const isAdmin = currentUser?.role === "admin";

        return `
            <div class="schedule-card">
                <div class="schedule-info">
                    <div class="schedule-top">
                        <span class="badge ${isOnline ? 'badge-online' : 'badge-offline'}">
                            ${isOnline ? '🌐 Online' : '🏫 Offline'}
                        </span>
                        <span class="badge badge-track">${s.track_name}</span>
                        <span class="badge badge-${s.status}">${s.status.toUpperCase()}</span>
                    </div>
                    <h3 class="schedule-title">${s.title}</h3>
                    <div class="schedule-details">
                        <span>📅 ${s.date}</span>
                        <span>⏰ ${s.time}</span>
                        <span>👨‍🏫 Trainer: <strong>${s.trainer_name || 'Assigned Trainer'}</strong></span>
                        ${isOnline 
                            ? `<span>🔗 <strong>Google Meet:</strong> ${s.meeting_link ? `<a href="${s.meeting_link}" target="_blank" style="color: var(--accent);">${s.meeting_link}</a>` : 'Link available before class'}</span>`
                            : `<span>📍 <strong>Location:</strong> ${s.classroom || 'Main Campus Hall'}</span>`
                        }
                    </div>
                </div>
                <div class="schedule-actions">
                    ${isOnline && s.meeting_link ? `
                        <a href="${s.meeting_link}" target="_blank" class="btn btn-primary btn-sm">Join Class</a>
                    ` : ''}
                    ${isAdmin ? `
                        <button class="btn btn-secondary btn-sm" onclick="openEditScheduleModal(${s.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteSchedule(${s.id})">Delete</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join("");
}

// --- Schedule Add / Edit / Delete ---
function openAddScheduleModal() {
    document.getElementById("schedule-modal-title").innerText = "Schedule New Training Session";
    document.getElementById("schedule-form").reset();
    document.getElementById("schedule-id-input").value = "";
    toggleScheduleModeInputs();
    openModal("modal-schedule");
}

function openEditScheduleModal(id) {
    const schedule = allSchedules.find(s => s.id === id);
    if (!schedule) return;

    document.getElementById("schedule-modal-title").innerText = "Edit Training Session";
    document.getElementById("schedule-id-input").value = schedule.id;
    document.getElementById("schedule-track-select").value = schedule.track_id;
    document.getElementById("schedule-title-input").value = schedule.title;
    document.getElementById("schedule-date-input").value = schedule.date;
    document.getElementById("schedule-time-input").value = schedule.time;
    document.getElementById("schedule-mode-select").value = schedule.mode;
    document.getElementById("schedule-link-input").value = schedule.meeting_link || "";
    document.getElementById("schedule-classroom-input").value = schedule.classroom || "";
    document.getElementById("schedule-status-select").value = schedule.status;

    toggleScheduleModeInputs();
    openModal("modal-schedule");
}

function toggleScheduleModeInputs() {
    const mode = document.getElementById("schedule-mode-select").value;
    const linkGroup = document.getElementById("group-meeting-link");
    const classroomGroup = document.getElementById("group-classroom");

    if (mode === "online") {
        linkGroup.style.display = "block";
        classroomGroup.style.display = "none";
    } else {
        linkGroup.style.display = "none";
        classroomGroup.style.display = "block";
    }
}

async function handleScheduleSubmit(e) {
    e.preventDefault();
    if (!currentToken || currentUser?.role !== "admin") {
        showToast("Admin authorization required.", "error");
        return;
    }

    const scheduleId = document.getElementById("schedule-id-input").value;
    const payload = {
        track_id: parseInt(document.getElementById("schedule-track-select").value),
        title: document.getElementById("schedule-title-input").value.trim(),
        date: document.getElementById("schedule-date-input").value.trim(),
        time: document.getElementById("schedule-time-input").value.trim(),
        mode: document.getElementById("schedule-mode-select").value,
        meeting_link: document.getElementById("schedule-link-input").value.trim() || null,
        classroom: document.getElementById("schedule-classroom-input").value.trim() || null,
        status: document.getElementById("schedule-status-select").value
    };

    try {
        let res;
        if (scheduleId) {
            // Update
            res = await fetch(`${API_BASE}/schedules/${scheduleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentToken}`
                },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            res = await fetch(`${API_BASE}/schedules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentToken}`
                },
                body: JSON.stringify(payload)
            });
        }

        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "Schedule saved successfully!", "success");
            closeModal("modal-schedule");
            loadSchedules();
            loadDashboardStats();
        } else {
            showToast(data.detail || "Failed to save schedule.", "error");
        }
    } catch (err) {
        showToast("Error connecting to server.", "error");
    }
}

async function deleteSchedule(id) {
    if (!confirm("Are you sure you want to delete this scheduled class?")) return;
    if (!currentToken || currentUser?.role !== "admin") {
        showToast("Admin authorization required.", "error");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/schedules/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "Schedule deleted.", "success");
            loadSchedules();
            loadDashboardStats();
        } else {
            showToast(data.detail || "Delete failed.", "error");
        }
    } catch (err) {
        showToast("Network error.", "error");
    }
}

// --- Materials & Notes Management ---
async function loadMaterials() {
    try {
        const res = await fetch(`${API_BASE}/materials`);
        if (!res.ok) return;
        allMaterials = await res.json();
        renderMaterials(allMaterials);
    } catch (e) {
        console.warn("Could not load materials", e);
    }
}

function renderMaterials(materials) {
    const container = document.getElementById("materials-list-container");
    if (!container) return;

    if (!materials || materials.length === 0) {
        container.innerHTML = `
            <div class="stat-card" style="text-align: center; padding: 30px;">
                <p>No syllabus or notes uploaded yet.</p>
                ${(currentUser?.role === 'trainer' || currentUser?.role === 'admin') ? '<button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="openModal(\'modal-upload-material\')">+ Upload Syllabus / Notes</button>' : ''}
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="data-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Title / Topic</th>
                        <th>Track</th>
                        <th>Trainer</th>
                        <th>Upload Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${materials.map(m => {
                        const canDelete = (currentUser?.role === 'admin') || (currentUser?.role === 'trainer' && currentUser?.id === m.trainer_id);
                        const downloadUrl = `${UPLOAD_BASE}${m.file_url}`;
                        return `
                            <tr>
                                <td>
                                    <span class="badge ${m.type === 'syllabus' ? 'badge-track' : 'badge-online'}">
                                        ${m.type.toUpperCase()}
                                    </span>
                                </td>
                                <td><strong>${m.title}</strong><br><small style="color: var(--text-muted);">${m.file_name}</small></td>
                                <td>${m.track_name}</td>
                                <td>${m.trainer_name}</td>
                                <td>${m.created_at}</td>
                                <td>
                                    <a href="${downloadUrl}" target="_blank" download class="btn btn-primary btn-sm">Download</a>
                                    ${canDelete ? `<button class="btn btn-danger btn-sm" onclick="deleteMaterial(${m.id})">Delete</button>` : ''}
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}

async function handleMaterialUpload(e) {
    e.preventDefault();
    if (!currentToken) {
        showToast("Please login as Trainer or Admin.", "error");
        return;
    }

    const fileInput = document.getElementById("material-file-input");
    if (!fileInput.files || fileInput.files.length === 0) {
        showToast("Please select a file to upload.", "error");
        return;
    }

    const formData = new FormData();
    formData.append("title", document.getElementById("material-title-input").value.trim());
    formData.append("type", document.getElementById("material-type-select").value);
    formData.append("track_id", document.getElementById("material-track-select").value);
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch(`${API_BASE}/materials/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${currentToken}`
            },
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "File uploaded successfully!", "success");
            closeModal("modal-upload-material");
            document.getElementById("material-upload-form").reset();
            loadMaterials();
            loadDashboardStats();
        } else {
            showToast(data.detail || "Upload failed.", "error");
        }
    } catch (err) {
        showToast("Network error uploading file.", "error");
    }
}

async function deleteMaterial(id) {
    if (!confirm("Are you sure you want to delete this study material?")) return;

    try {
        const res = await fetch(`${API_BASE}/materials/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "Material deleted.", "success");
            loadMaterials();
            loadDashboardStats();
        } else {
            showToast(data.detail || "Delete failed.", "error");
        }
    } catch (err) {
        showToast("Network error.", "error");
    }
}

// --- Student Registration (Roll No + Email Whitelist Gatekeeper) ---
async function handleStudentRegister(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById("reg-name").value.trim(),
        email: document.getElementById("reg-email").value.trim(),
        roll_no: document.getElementById("reg-rollno").value.trim(),
        password: document.getElementById("reg-password").value
    };

    try {
        const res = await fetch(`${API_BASE}/auth/register-student`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            currentUser = data.user;
            currentToken = data.access_token;
            localStorage.setItem("tms_user", JSON.stringify(currentUser));
            localStorage.setItem("tms_token", currentToken);

            showToast("Roll Number Verified! Registration Successful 🎉", "success");
            closeModal("modal-register");
            updateUserUI();
            switchTab("student");
            loadDashboardStats();
        } else {
            showToast(data.detail || "Verification failed. Check your Roll Number.", "error");
        }
    } catch (err) {
        showToast("Server connection error.", "error");
    }
}

// --- General User Login ---
async function handleUserLogin(e) {
    e.preventDefault();
    const payload = {
        email: document.getElementById("login-email").value.trim(),
        password: document.getElementById("login-password").value
    };

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            currentUser = data.user;
            currentToken = data.access_token;
            localStorage.setItem("tms_user", JSON.stringify(currentUser));
            localStorage.setItem("tms_token", currentToken);

            showToast(`Welcome back, ${currentUser.name}!`, "success");
            closeModal("modal-login");
            updateUserUI();

            // Redirect to appropriate role tab
            if (currentUser.role === "admin") switchTab("admin");
            else if (currentUser.role === "trainer") switchTab("trainer");
            else switchTab("student");
        } else {
            showToast(data.detail || "Invalid login credentials.", "error");
        }
    } catch (err) {
        showToast("Server connection error.", "error");
    }
}

function logout() {
    currentUser = null;
    currentToken = null;
    localStorage.removeItem("tms_user");
    localStorage.removeItem("tms_token");
    updateUserUI();
    showToast("Logged out successfully.", "info");
    switchTab("home");
}

// --- Quick Demo Credentials Filler ---
function fillDemoLogin(role) {
    const emailInput = document.getElementById("login-email");
    const passInput = document.getElementById("login-password");

    if (role === 'admin') {
        emailInput.value = "admin@tms.com";
        passInput.value = "admin123";
    } else if (role === 'trainer') {
        emailInput.value = "trainer@tms.com";
        passInput.value = "trainer123";
    }
}

// --- Admin Section Operations ---
async function loadAdminData() {
    if (!currentToken || currentUser?.role !== "admin") return;
    loadEligibleStudents();
    loadTrainersList();
    loadAllRegisteredStudents();
}

async function loadEligibleStudents() {
    try {
        const res = await fetch(`${API_BASE}/admin/eligible-students`, {
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        if (!res.ok) return;
        const list = await res.json();
        const tbody = document.getElementById("admin-eligible-table-body");
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No pre-approved roll numbers found.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(item => `
            <tr>
                <td><strong>${item.roll_no}</strong></td>
                <td>${item.email}</td>
                <td>${item.name || '-'}</td>
                <td>${item.track_name}</td>
                <td>
                    <span class="badge ${item.is_registered ? 'badge-upcoming' : 'badge-track'}">
                        ${item.is_registered ? '✅ Registered' : '⏳ Pending'}
                    </span>
                </td>
            </tr>
        `).join("");
    } catch (e) {
        console.warn("Error loading eligible students", e);
    }
}

async function handleAddEligibleStudent(e) {
    e.preventDefault();
    const payload = {
        roll_no: document.getElementById("eligible-rollno-input").value.trim().toUpperCase(),
        email: document.getElementById("eligible-email-input").value.trim().toLowerCase(),
        name: document.getElementById("eligible-name-input").value.trim() || null,
        track_id: parseInt(document.getElementById("eligible-track-select").value)
    };

    try {
        const res = await fetch(`${API_BASE}/admin/eligible-students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentToken}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "Roll Number whitelisted!", "success");
            closeModal("modal-add-eligible");
            document.getElementById("add-eligible-form").reset();
            loadEligibleStudents();
        } else {
            showToast(data.detail || "Error adding roll number.", "error");
        }
    } catch (err) {
        showToast("Network error.", "error");
    }
}

async function loadTrainersList() {
    try {
        const res = await fetch(`${API_BASE}/admin/trainers`, {
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        if (!res.ok) return;
        const list = await res.json();
        const tbody = document.getElementById("admin-trainers-table-body");
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No trainers added yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(t => `
            <tr>
                <td><strong>${t.name}</strong></td>
                <td>${t.email}</td>
                <td>${t.track_name}</td>
                <td>${t.created_at}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteTrainer(${t.id})">Delete</button>
                </td>
            </tr>
        `).join("");
    } catch (e) {
        console.warn("Error loading trainers", e);
    }
}

async function handleAddTrainer(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById("trainer-name-input").value.trim(),
        email: document.getElementById("trainer-email-input").value.trim().toLowerCase(),
        password: document.getElementById("trainer-password-input").value,
        track_id: parseInt(document.getElementById("trainer-track-select").value)
    };

    try {
        const res = await fetch(`${API_BASE}/admin/trainers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentToken}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "Trainer created successfully!", "success");
            closeModal("modal-add-trainer");
            document.getElementById("add-trainer-form").reset();
            loadTrainersList();
            loadDashboardStats();
        } else {
            showToast(data.detail || "Error creating trainer.", "error");
        }
    } catch (err) {
        showToast("Network error.", "error");
    }
}

async function deleteTrainer(id) {
    if (!confirm("Are you sure you want to remove this trainer?")) return;

    try {
        const res = await fetch(`${API_BASE}/admin/trainers/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "Trainer removed.", "success");
            loadTrainersList();
            loadDashboardStats();
        } else {
            showToast(data.detail || "Delete failed.", "error");
        }
    } catch (err) {
        showToast("Network error.", "error");
    }
}

async function loadAllRegisteredStudents() {
    try {
        const res = await fetch(`${API_BASE}/admin/students`, {
            headers: { "Authorization": `Bearer ${currentToken}` }
        });
        if (!res.ok) return;
        const list = await res.json();
        const tbody = document.getElementById("admin-students-table-body");
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No students have registered yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(s => `
            <tr>
                <td><strong>${s.roll_no || '-'}</strong></td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.track_name}</td>
                <td>${s.registered_at}</td>
            </tr>
        `).join("");
    } catch (e) {
        console.warn("Error loading registered students", e);
    }
}

async function handleClearData(e) {
    e.preventDefault();
    const pass = document.getElementById("clear-admin-password").value;
    if (!pass) return;

    const formData = new FormData();
    formData.append("confirm_password", pass);

    try {
        const res = await fetch(`${API_BASE}/admin/clear-data`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${currentToken}` },
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            showToast(data.message || "Data cleared successfully.", "success");
            closeModal("modal-clear-data");
            document.getElementById("clear-data-form").reset();
            loadDashboardStats();
            loadSchedules();
            loadMaterials();
            loadAdminData();
        } else {
            showToast(data.detail || "Failed to clear data.", "error");
        }
    } catch (err) {
        showToast("Network error.", "error");
    }
}

// --- Trainer Section Operations ---
async function loadTrainerData() {
    if (!currentUser) return;
    document.getElementById("trainer-profile-name").innerText = currentUser.name;
    document.getElementById("trainer-profile-track").innerText = currentUser.track_name || "General Trainer";
    loadAllRegisteredStudents();
}

// --- Student Section Operations ---
async function loadStudentData() {
    if (!currentUser) return;
    document.getElementById("student-profile-name").innerText = currentUser.name;
    document.getElementById("student-profile-roll").innerText = currentUser.roll_no || "N/A";
    document.getElementById("student-profile-track").innerText = currentUser.track_name || "Enrolled Track";
}

// --- Modal Helper Functions ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "flex";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
}

// --- Toast Alerts ---
function showToast(msg, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✅" : (type === "error" ? "⚠️" : "ℹ️");
    toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}

// --- Form & Event Listeners ---
function setupEventListeners() {
    // Mode toggler in schedule form
    const modeSelect = document.getElementById("schedule-mode-select");
    if (modeSelect) modeSelect.addEventListener("change", toggleScheduleModeInputs);

    // Filter listeners
    document.getElementById("filter-track-select")?.addEventListener("change", loadSchedules);
    document.getElementById("filter-mode-select")?.addEventListener("change", loadSchedules);

    // Form submit bindings
    document.getElementById("login-form")?.addEventListener("submit", handleUserLogin);
    document.getElementById("register-form")?.addEventListener("submit", handleStudentRegister);
    document.getElementById("schedule-form")?.addEventListener("submit", handleScheduleSubmit);
    document.getElementById("material-upload-form")?.addEventListener("submit", handleMaterialUpload);
    document.getElementById("add-trainer-form")?.addEventListener("submit", handleAddTrainer);
    document.getElementById("add-eligible-form")?.addEventListener("submit", handleAddEligibleStudent);
    document.getElementById("clear-data-form")?.addEventListener("submit", handleClearData);

    // Close modals on outside click
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            e.target.style.display = "none";
        }
    });
}
