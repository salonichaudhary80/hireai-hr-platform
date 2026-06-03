package com.hireai.hireai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private Long jobId;
    private String resumeFileName;
    private String resumePath;
    private Double resumeScore;

    @Column(length = 2000)
    private String matchedSkills;

    private String status;
    private String videoPath;

    public Candidate() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public String getResumePath() {
        return resumePath;
    }

    public Double getResumeScore() {
        return resumeScore;
    }

    public String getMatchedSkills() {
        return matchedSkills;
    }

    public String getStatus() {
        return status;
    }

    public String getVideoPath() {
        return videoPath;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public void setResumeScore(Double resumeScore) {
        this.resumeScore = resumeScore;
    }

    public void setMatchedSkills(String matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }
}