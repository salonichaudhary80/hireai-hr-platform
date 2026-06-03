package com.hireai.hireai.repository;

import com.hireai.hireai.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    long countByStatus(String status);

    List<Candidate> findByJobId(Long jobId);
}