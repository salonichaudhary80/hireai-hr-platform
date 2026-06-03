# HireAI - AI-Based HR Recruitment Platform

HireAI is a full-stack HR recruitment and onboarding platform built using Java, Spring Boot, MySQL, HTML, CSS, and JavaScript.

The project helps HR teams create job openings, upload candidate resumes, automatically generate resume match scores, shortlist candidates, update candidate status, and view hiring analytics.

---

## Project Objective

The main objective of this project is to simplify and automate the initial HR recruitment process.

Manual resume screening takes a lot of time. HireAI reduces this effort by extracting text from resumes and comparing candidate skills with the required skills mentioned in the job description.

Based on the matched skills, the system generates a resume score and assigns a candidate status such as SHORTLISTED, UNDER_REVIEW, or REJECTED.

---

## Features

* HR user registration
* HR login
* Job creation
* Resume upload
* Resume text extraction from PDF
* Skill-based resume screening
* Resume match score generation
* Candidate status management
* Candidate list view
* Hiring analytics dashboard
* MySQL database integration
* Static frontend using HTML, CSS, and JavaScript
* REST API backend using Spring Boot

---

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* MySQL
* Apache PDFBox
* Maven

### Frontend

* HTML
* CSS
* JavaScript

### Tools Used

* VS Code
* Postman
* MySQL Workbench
* Git
* GitHub

---

## Main Modules

### 1. Authentication Module

Allows users to register and login.

Supported roles:

* HR
* ADMIN
* CANDIDATE

### 2. Job Management Module

HR can create job openings with details such as:

* Job title
* Description
* Required skills
* Experience

### 3. Resume Screening Module

Candidate resumes are uploaded in PDF format.

The system extracts text from the resume using Apache PDFBox and compares it with the job's required skills.

### 4. Candidate Management Module

HR can view candidates and update their status.

Supported statuses:

* SHORTLISTED
* UNDER_REVIEW
* REJECTED
* ONBOARDED

### 5. Analytics Module

Displays hiring-related statistics such as:

* Total jobs
* Total candidates
* Shortlisted candidates
* Under review candidates
* Rejected candidates
* Onboarded candidates

---

## Resume Screening Logic

The resume screening logic works in the following way:

1. HR creates a job and enters required skills.
2. Candidate resume is uploaded as a PDF.
3. The system extracts text from the resume.
4. The extracted text is compared with the required skills.
5. A score is generated based on matched skills.
6. Candidate status is assigned automatically.

### Scoring Logic

| Score Range   | Status       |
| ------------- | ------------ |
| 80% and above | SHORTLISTED  |
| 50% to 79%    | UNDER_REVIEW |
| Below 50%     | REJECTED     |

---

## Project Structure

```text
hireai/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/hireai/hireai/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── repository/
│       │       ├── service/
│       │       └── HireaiApplication.java
│       │
│       └── resources/
│           ├── static/
│           │   ├── index.html
│           │   ├── register.html
│           │   ├── dashboard.html
│           │   ├── create-job.html
│           │   ├── upload-resume.html
│           │   ├── candidates.html
│           │   ├── analytics.html
│           │   ├── css/
│           │   │   └── style.css
│           │   └── js/
│           │       └── app.js
│           │
│           └── application.properties
│
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

## Database Tables

The project uses MySQL and creates the following tables:

### users

Stores user registration and login details.

### jobs

Stores job details created by HR.

### candidates

Stores candidate details, resume score, matched skills, status, and uploaded resume path.

---

## Main API Endpoints

### Authentication APIs

```text
POST /api/auth/register
POST /api/auth/login
```

### Job APIs

```text
POST /api/jobs
GET /api/jobs
GET /api/jobs/{id}
```

### Candidate APIs

```text
POST /api/candidates/apply
POST /api/candidates/bulk-upload
GET /api/candidates
GET /api/candidates/job/{jobId}
PUT /api/candidates/{id}/status
POST /api/candidates/{id}/video
```

### Dashboard API

```text
GET /api/dashboard/stats
```

---

## How to Run the Project Locally

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/hireai-hr-platform.git
cd hireai-hr-platform
```

### Step 2: Create MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE hireai_db;
```

### Step 3: Configure Database

Open:

```text
src/main/resources/application.properties
```

Update your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hireai_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### Step 4: Run the Project

```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

### Step 5: Open the Application

```text
http://localhost:8085/index.html
```

---

## Demo Login

Create a user from the Register page or use Postman to register a user.

Example:

```text
Email: hr@hireai.com
Password: 123456
Role: HR
```

---

## Application Flow

1. Register as HR
2. Login
3. Create a job
4. Upload candidate resume
5. View resume score and matched skills
6. View candidate list
7. Update candidate status
8. View analytics dashboard

---

## Screens/Pages

* Login Page
* Register Page
* HR Dashboard
* Create Job Page
* Upload Resume Page
* Candidate List Page
* Analytics Page

---

## Future Enhancements

* JWT-based authentication
* Password encryption using BCrypt
* Role-based access control
* Cloud file storage for resumes
* AI/NLP-based semantic resume matching
* Video interview analysis
* Email notification system
* Admin dashboard
* Candidate self-service portal

---

## Project Summary

HireAI is an AI-inspired HR recruitment platform that automates resume screening and candidate tracking. It demonstrates full-stack development using Java, Spring Boot, MySQL, HTML, CSS, and JavaScript.

The project is suitable for hackathon submission, internship demonstration, and beginner-level full-stack project presentation.
