const API_BASE = "";

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

            window.location.href = "dashboard.html";

        } catch (error) {
            document.getElementById("loginMessage").innerText = "Invalid email or password.";
            document.getElementById("loginMessage").style.color = "red";
        }
    });
}

// PAGE LOAD HANDLER
window.addEventListener("load", function () {
    const currentPage = window.location.pathname;

    if (
        currentPage.includes("dashboard.html") ||
        currentPage.includes("create-job.html") ||
        currentPage.includes("upload-resume.html") ||
        currentPage.includes("candidates.html") ||
        currentPage.includes("analytics.html")
    ) {
        checkLogin();
    }

    if (currentPage.includes("dashboard.html")) {
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
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const welcomeText = document.getElementById("welcomeText");

    if (welcomeText) {
        welcomeText.innerText = `Welcome, ${user.name} (${user.role})`;
    }
}

// DASHBOARD STATS
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE}/api/dashboard/stats`);
        const stats = await response.json();

        document.getElementById("totalJobs").innerText = stats.totalJobs || 0;
        document.getElementById("totalCandidates").innerText = stats.totalCandidates || 0;
        document.getElementById("shortlisted").innerText = stats.shortlisted || 0;
        document.getElementById("rejected").innerText = stats.rejected || 0;

    } catch (error) {
        console.log("Dashboard stats loading failed", error);
    }
}

// CREATE JOB
const createJobForm = document.getElementById("createJobForm");

if (createJobForm) {
    createJobForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const user = JSON.parse(localStorage.getItem("loggedInUser"));

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

            document.getElementById("jobMessage").innerText = "Job created successfully.";
            document.getElementById("jobMessage").style.color = "green";
            createJobForm.reset();

        } catch (error) {
            document.getElementById("jobMessage").innerText = "Failed to create job.";
            document.getElementById("jobMessage").style.color = "red";
        }
    });
}

// LOAD JOBS INTO DROPDOWN
async function loadJobsInDropdown() {
    try {
        const response = await fetch(`${API_BASE}/api/jobs`);
        const jobs = await response.json();

        const jobSelect = document.getElementById("jobSelect");

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

// UPLOAD RESUME
const resumeUploadForm = document.getElementById("resumeUploadForm");

if (resumeUploadForm) {
    resumeUploadForm.addEventListener("submit", async function (event) {
        event.preventDefault();

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
                `Resume uploaded successfully. Score: ${candidate.resumeScore.toFixed(2)}%, Status: ${candidate.status}`;

            document.getElementById("resumeMessage").style.color = "green";
            resumeUploadForm.reset();

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
        const candidates = await response.json();

        const tableBody = document.getElementById("candidateTableBody");
        tableBody.innerHTML = "";

        candidates.forEach(candidate => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${candidate.name}</td>
                <td>${candidate.email}</td>
                <td>${candidate.phone}</td>
                <td>${candidate.resumeScore ? candidate.resumeScore.toFixed(2) + "%" : "0%"}</td>
                <td>${candidate.matchedSkills || "-"}</td>
                <td>${candidate.status}</td>
                <td>
                    <select id="status-${candidate.id}">
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                        <option value="REJECTED">REJECTED</option>
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
        const stats = await response.json();

        document.getElementById("analyticsTotalJobs").innerText = stats.totalJobs || 0;
        document.getElementById("analyticsTotalCandidates").innerText = stats.totalCandidates || 0;
        document.getElementById("analyticsShortlisted").innerText = stats.shortlisted || 0;
        document.getElementById("analyticsUnderReview").innerText = stats.underReview || 0;
        document.getElementById("analyticsRejected").innerText = stats.rejected || 0;
        document.getElementById("analyticsOnboarded").innerText = stats.onboarded || 0;

    } catch (error) {
        console.log("Analytics loading failed", error);
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}