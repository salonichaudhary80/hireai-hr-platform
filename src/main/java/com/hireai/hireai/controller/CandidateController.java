package com.hireai.hireai.controller;

import com.hireai.hireai.entity.Candidate;
import com.hireai.hireai.service.CandidateService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin("*")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping("/apply")
    public Candidate applyForJob(
            @RequestParam Long jobId,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam MultipartFile resume
    ) throws Exception {
        return candidateService.applyForJob(jobId, name, email, phone, resume);
    }

    @PostMapping("/bulk-upload")
    public List<Candidate> bulkUpload(
            @RequestParam Long jobId,
            @RequestParam MultipartFile[] files
    ) throws Exception {
        return candidateService.bulkUpload(jobId, files);
    }

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @GetMapping("/job/{jobId}")
    public List<Candidate> getCandidatesByJobId(@PathVariable Long jobId) {
        return candidateService.getCandidatesByJobId(jobId);
    }

    @PutMapping("/{id}/status")
    public Candidate updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return candidateService.updateStatus(id, status);
    }

    @PostMapping("/{id}/video")
    public Candidate uploadVideo(
            @PathVariable Long id,
            @RequestParam MultipartFile video
    ) throws Exception {
        return candidateService.uploadVideo(id, video);
    }
}