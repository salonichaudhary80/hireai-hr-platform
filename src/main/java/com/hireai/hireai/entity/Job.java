package com.hireai.hireai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 3000)
    private String description;

    private String requiredSkills;

    private String experience;

    private String createdBy;

    public Job() {
    }

    public Job(Long id, String title, String description, String requiredSkills, String experience, String createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.experience = experience;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public String getExperience() {
        return experience;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}