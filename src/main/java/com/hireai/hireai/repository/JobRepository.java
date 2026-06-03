package com.hireai.hireai.repository;

import com.hireai.hireai.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}