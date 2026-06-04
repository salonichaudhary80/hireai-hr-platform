const API_BASE = "";

// ROLE HELPERS
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function getUserRole() {
    const user = getLoggedInUser();
    return user && user.role ? user.role.toUpperCase() : null;
}

function isHRUser() {
    const role = getUserRole();
    return role === "HR" || role === "ADMIN";
}

function isCandidateUser() {
    return getUserRole() === "CANDIDATE";
}

function protectHRPage() {
    const user = getLoggedInUser();

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    if (!isHRUser()) {
        alert("Access denied. This page is only for HR/Admin users.");
        window.location.href = "candidate-dashboard.html";
    }
}

function protectCandidatePage() {
    const user = getLoggedInUser();

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    if (!isCandidateUser()) {
        window.location.href = "dashboard.html";
    }
}

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userData = {
            name: document.getElementById("registerName").value,
            email: document.getElementById("registerEmail").value,
            password: document.getElementById("registerPassword").value,
            role: document.getElementById("registerRole").value
        };

        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            document.getElementById("registerMessage").innerText = "Registration successful. Please login.";
            document.getElementById("registerMessage").style.color = "green";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);

        } catch (error) {
            document.getElementById("registerMessage").innerText = "Registration failed. Try again.";
            document.getElementById("registerMessage").style.color = "red";
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const loginData = {
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value
        };

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();

            localStorage.setItem("loggedInUser", JSON.stringify(data));

            const role = data.role ? data.role.toUpperCase() : "";

            if (role === "CANDIDATE") {
                window.location.href = "candidate-dashboard.html";
            } else if (role === "HR" || role === "ADMIN") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "index.html";
            }

        } catch (error) {
            document.getElementById("loginMessage").innerText = "Invalid email or password.";
            document.getElementById("loginMessage").style.color = "red";
        }
    });
}

// PAGE LOAD HANDLER
window.addEventListener("load", function () {
    const currentPage = window.location.pathname;

    const hrPages = [
        "dashboard.html",
        "create-job.html",
        "upload-resume.html",
        "bulk-upload.html",
        "candidates.html",
        "ranking.html",
        "video-interview.html",
        "interview-scorecard.html",
        "onboarding.html",
        "job-analytics.html",
        "communication.html",
        "offer-letter.html",
        "analytics.html"
    ];

    const isHRPage = hrPages.some(page => currentPage.includes(page));

    if (isHRPage) {
        protectHRPage();
    }

    if (currentPage.includes("candidate-dashboard.html")) {
        protectCandidatePage();
        fillCandidateDetails();
        loadJobsInCandidateDashboard();
    }

    if (currentPage.includes("dashboard.html")) {
        checkLogin();
        loadDashboardStats();
    }

    if (currentPage.includes("upload-resume.html")) {
        loadJobsInDropdown();
    }

    if (currentPage.includes("candidates.html")) {
        loadCandidates();
    }

    if (currentPage.includes("analytics.html")) {
        loadAnalyticsStats();
    }
});

// CHECK LOGIN
function checkLogin() {
    const user = getLoggedInUser();

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const welcomeText = document.getElementById("welcomeText");

    if (welcomeText) {
        welcomeText.innerText = `Welcome, ${user.name} (${user.role})`;
    }
}

// CANDIDATE DASHBOARD DETAILS
function fillCandidateDetails() {
    const user = getLoggedInUser();

    const welcomeText = document.getElementById("candidateWelcome");
    const candidateName = document.getElementById("candidateName");
    const candidateEmail = document.getElementById("candidateEmail");

    if (user && welcomeText) {
        welcomeText.innerText = `Welcome, ${user.name} (${user.role})`;
    }

    if (user && candidateName) {
        candidateName.value = user.name || "";
    }

    if (user && candidateEmail) {
        candidateEmail.value = user.email || "";
    }
}

// LOAD JOBS FOR CANDIDATE DASHBOARD
async function loadJobsInCandidateDashboard() {
    try {
        const response = await fetch(`${API_BASE}/api/jobs`);

        if (!response.ok) {
            throw new Error("Failed to load jobs");
        }

        const jobs = await response.json();
        const jobSelect = document.getElementById("jobSelect");
        const applicationMessage = document.getElementById("applicationMessage");

        if (!jobSelect) {
            return;
        }

        jobSelect.innerHTML = '<option value="">Select Job</option>';

        if (jobs.length === 0) {
            if (applicationMessage) {
                applicationMessage.innerText = "No jobs available right now. Please check later.";
                applicationMessage.style.color = "red";
            }
            return;
        }

        jobs.forEach(job => {
            const option = document.createElement("option");
            option.value = job.id;
            option.textContent = `${job.title} - ${job.experience}`;
            jobSelect.appendChild(option);
        });

    } catch (error) {
        console.log("Failed to load jobs for candidate", error);

        const applicationMessage = document.getElementById("applicationMessage");

        if (applicationMessage) {
            applicationMessage.innerText = "Failed to load jobs.";
            applicationMessage.style.color = "red";
        }
    }
}

// CANDIDATE APPLICATION SUBMIT
const candidateApplicationForm = document.getElementById("candidateApplicationForm");

if (candidateApplicationForm) {
    candidateApplicationForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!isCandidateUser()) {
            alert("Only candidates can submit applications from this page.");
            window.location.href = "dashboard.html";
            return;
        }

        const jobId = document.getElementById("jobSelect").value;
        const name = document.getElementById("candidateName").value;
        const email = document.getElementById("candidateEmail").value;
        const phone = document.getElementById("candidatePhone").value;
        const resumeFile = document.getElementById("resumeFile").files[0];

        if (!jobId) {
            alert("Please select a job.");
            return;
        }

        if (!resumeFile) {
            alert("Please upload your resume PDF.");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", jobId);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("resume", resumeFile);

        try {
            document.getElementById("applicationMessage").innerText = "Submitting application...";
            document.getElementById("applicationMessage").style.color = "blue";

            const response = await fetch(`${API_BASE}/api/candidates/apply`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Application submission failed");
            }

            const candidate = await response.json();

            document.getElementById("applicationMessage").innerText =
                `Application submitted successfully. Resume Score: ${candidate.resumeScore ? candidate.resumeScore.toFixed(2) : "0.00"}%, Status: ${candidate.status}`;

            document.getElementById("applicationMessage").style.color = "green";

            document.getElementById("resumeFile").value = "";

        } catch (error) {
            console.log("Candidate application error:", error);

            document.getElementById("applicationMessage").innerText =
                "Failed to submit application. Please try again.";

            document.getElementById("applicationMessage").style.color = "red";
        }
    });
}

// DASHBOARD STATS
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE}/api/dashboard/stats`);

        if (!response.ok) {
            throw new Error("Failed to load dashboard stats");
        }

        const stats = await response.json();

        if (document.getElementById("totalJobs")) {
            document.getElementById("totalJobs").innerText = stats.totalJobs || 0;
        }

        if (document.getElementById("totalCandidates")) {
            document.getElementById("totalCandidates").innerText = stats.totalCandidates || 0;
        }

        if (document.getElementById("shortlisted")) {
            document.getElementById("shortlisted").innerText = stats.shortlisted || 0;
        }

        if (document.getElementById("rejected")) {
            document.getElementById("rejected").innerText = stats.rejected || 0;
        }

    } catch (error) {
        console.log("Dashboard stats loading failed", error);
    }
}

// CREATE JOB
const createJobForm = document.getElementById("createJobForm");

if (createJobForm) {
    createJobForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!isHRUser()) {
            alert("Only HR/Admin can create jobs.");
            window.location.href = "candidate-dashboard.html";
            return;
        }

        const user = getLoggedInUser();

        const jobData = {
            title: document.getElementById("jobTitle").value,
            description: document.getElementById("jobDescription").value,
            requiredSkills: document.getElementById("requiredSkills").value,
            experience: document.getElementById("experience").value,
            createdBy: user ? user.name : "HR User"
        };

        try {
            const response = await fetch(`${API_BASE}/api/jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jobData)
            });

            if (!response.ok) {
                throw new Error("Job creation failed");
            }

            const data = await response.json();

            const jobMessage = document.getElementById("jobMessage");

            if (jobMessage) {
                jobMessage.innerText = "Job created successfully with ID: " + data.id;
                jobMessage.style.color = "green";
            }

            createJobForm.reset();

        } catch (error) {
            const jobMessage = document.getElementById("jobMessage");

            if (jobMessage) {
                jobMessage.innerText = "Failed to create job.";
                jobMessage.style.color = "red";
            }
        }
    });
}

// LOAD JOBS INTO HR UPLOAD RESUME DROPDOWN
async function loadJobsInDropdown() {
    try {
        const response = await fetch(`${API_BASE}/api/jobs`);

        if (!response.ok) {
            throw new Error("Failed to load jobs");
        }

        const jobs = await response.json();
        const jobSelect = document.getElementById("jobSelect");

        if (!jobSelect) {
            return;
        }

        jobSelect.innerHTML = '<option value="">Select Job</option>';

        jobs.forEach(job => {
            const option = document.createElement("option");
            option.value = job.id;
            option.textContent = `${job.title} - ${job.experience}`;
            jobSelect.appendChild(option);
        });

    } catch (error) {
        console.log("Failed to load jobs", error);
    }
}

// HR UPLOAD RESUME
const resumeUploadForm = document.getElementById("resumeUploadForm");

if (resumeUploadForm) {
    resumeUploadForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!isHRUser()) {
            alert("Only HR/Admin can upload resumes.");
            window.location.href = "candidate-dashboard.html";
            return;
        }

        const formData = new FormData();

        formData.append("jobId", document.getElementById("jobSelect").value);
        formData.append("name", document.getElementById("candidateName").value);
        formData.append("email", document.getElementById("candidateEmail").value);
        formData.append("phone", document.getElementById("candidatePhone").value);
        formData.append("resume", document.getElementById("resumeFile").files[0]);

        try {
            const response = await fetch(`${API_BASE}/api/candidates/apply`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Resume upload failed");
            }

            const candidate = await response.json();

            document.getElementById("resumeMessage").innerText =
                `Resume uploaded successfully. Score: ${candidate.resumeScore ? candidate.resumeScore.toFixed(2) : "0.00"}%, Status: ${candidate.status}`;

            document.getElementById("resumeMessage").style.color = "green";
            resumeUploadForm.reset();
            loadJobsInDropdown();

        } catch (error) {
            document.getElementById("resumeMessage").innerText = "Failed to upload resume.";
            document.getElementById("resumeMessage").style.color = "red";
        }
    });
}

// LOAD CANDIDATES
async function loadCandidates() {
    try {
        const response = await fetch(`${API_BASE}/api/candidates`);

        if (!response.ok) {
            throw new Error("Failed to load candidates");
        }

        const candidates = await response.json();

        const tableBody = document.getElementById("candidateTableBody");

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        candidates.forEach(candidate => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${candidate.name}</td>
                <td>${candidate.email}</td>
                <td>${candidate.phone}</td>
                <td>${candidate.resumeScore ? candidate.resumeScore.toFixed(2) + "%" : "0%"}</td>
                <td>${candidate.matchedSkills || "-"}</td>
                <td>
                    <span class="status-badge ${getStatusClass(candidate.status)}">
                        ${candidate.status}
                    </span>
                </td>
                <td>
                    <select id="status-${candidate.id}">
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="VIDEO_SUBMITTED">VIDEO_SUBMITTED</option>
                        <option value="ONBOARDED">ONBOARDED</option>
                    </select>
                    <button onclick="updateCandidateStatus(${candidate.id})">Update</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.log("Failed to load candidates", error);
    }
}

// UPDATE CANDIDATE STATUS
async function updateCandidateStatus(candidateId) {
    if (!isHRUser()) {
        alert("Only HR/Admin can update candidate status.");
        window.location.href = "candidate-dashboard.html";
        return;
    }

    const status = document.getElementById(`status-${candidateId}`).value;

    try {
        const response = await fetch(`${API_BASE}/api/candidates/${candidateId}/status?status=${status}`, {
            method: "PUT"
        });

        if (!response.ok) {
            throw new Error("Status update failed");
        }

        alert("Candidate status updated successfully.");
        loadCandidates();

    } catch (error) {
        alert("Failed to update candidate status.");
    }
}

// ANALYTICS
async function loadAnalyticsStats() {
    try {
        const response = await fetch(`${API_BASE}/api/dashboard/stats`);

        if (!response.ok) {
            throw new Error("Failed to load analytics");
        }

        const stats = await response.json();

        if (document.getElementById("totalJobs")) {
            document.getElementById("totalJobs").innerText = stats.totalJobs || 0;
        }

        if (document.getElementById("totalCandidates")) {
            document.getElementById("totalCandidates").innerText = stats.totalCandidates || 0;
        }

        if (document.getElementById("shortlisted")) {
            document.getElementById("shortlisted").innerText = stats.shortlisted || 0;
        }

        if (document.getElementById("underReview")) {
            document.getElementById("underReview").innerText = stats.underReview || 0;
        }

        if (document.getElementById("rejected")) {
            document.getElementById("rejected").innerText = stats.rejected || 0;
        }

        if (document.getElementById("videoSubmitted")) {
            document.getElementById("videoSubmitted").innerText = stats.videoSubmitted || 0;
        }

        if (document.getElementById("onboarded")) {
            document.getElementById("onboarded").innerText = stats.onboarded || 0;
        }

    } catch (error) {
        console.log("Analytics loading failed", error);
    }
}

// STATUS BADGE CLASS
function getStatusClass(status) {
    if (status === "SHORTLISTED") return "status-shortlisted";
    if (status === "UNDER_REVIEW") return "status-review";
    if (status === "REJECTED") return "status-rejected";
    if (status === "ONBOARDED") return "status-onboarded";
    return "status-default";
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}