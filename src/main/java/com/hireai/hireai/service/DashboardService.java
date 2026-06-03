package com.hireai.hireai.service;

import com.hireai.hireai.repository.CandidateRepository;
import com.hireai.hireai.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;

    public DashboardService(CandidateRepository candidateRepository, JobRepository jobRepository) {
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalJobs", jobRepository.count());
        stats.put("totalCandidates", candidateRepository.count());
        stats.put("shortlisted", candidateRepository.countByStatus("SHORTLISTED"));
        stats.put("underReview", candidateRepository.countByStatus("UNDER_REVIEW"));
        stats.put("rejected", candidateRepository.countByStatus("REJECTED"));
        stats.put("videoSubmitted", candidateRepository.countByStatus("VIDEO_SUBMITTED"));
        stats.put("onboarded", candidateRepository.countByStatus("ONBOARDED"));

        return stats;
    }
}