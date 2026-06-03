package com.hireai.hireai.service;

import com.hireai.hireai.entity.Candidate;
import com.hireai.hireai.entity.Job;
import com.hireai.hireai.repository.CandidateRepository;
import com.hireai.hireai.repository.JobRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public CandidateService(CandidateRepository candidateRepository, JobRepository jobRepository) {
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
    }

    public Candidate applyForJob(
            Long jobId,
            String name,
            String email,
            String phone,
            MultipartFile resume
    ) throws Exception {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        if (resume == null || resume.isEmpty()) {
            throw new RuntimeException("Resume file is missing");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String originalFileName = resume.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "resume.pdf";
        }

        String safeFileName = System.currentTimeMillis() + "_" +
                originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_");

        Path targetPath = uploadPath.resolve(safeFileName);

        resume.transferTo(targetPath.toFile());

        String resumeText = extractTextFromPdfSafely(targetPath.toFile());

        ScreeningResult result = calculateScore(resumeText, job.getRequiredSkills());

        Candidate candidate = new Candidate();
        candidate.setName(name);
        candidate.setEmail(email);
        candidate.setPhone(phone);
        candidate.setJobId(jobId);
        candidate.setResumeFileName(safeFileName);
        candidate.setResumePath(targetPath.toString());
        candidate.setResumeScore(result.score);
        candidate.setMatchedSkills(result.matchedSkills);

        if (result.score >= 80) {
            candidate.setStatus("SHORTLISTED");
        } else if (result.score >= 50) {
            candidate.setStatus("UNDER_REVIEW");
        } else {
            candidate.setStatus("REJECTED");
        }

        return candidateRepository.save(candidate);
    }

    public List<Candidate> bulkUpload(Long jobId, MultipartFile[] files) throws Exception {
        List<Candidate> uploadedCandidates = new ArrayList<>();

        int count = 1;

        for (MultipartFile file : files) {
            Candidate candidate = applyForJob(
                    jobId,
                    "Candidate " + count,
                    "candidate" + count + "@mail.com",
                    "9999999999",
                    file
            );

            uploadedCandidates.add(candidate);
            count++;
        }

        return uploadedCandidates;
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public List<Candidate> getCandidatesByJobId(Long jobId) {
        return candidateRepository.findByJobId(jobId);
    }

    public Candidate updateStatus(Long candidateId, String status) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + candidateId));

        candidate.setStatus(status);
        return candidateRepository.save(candidate);
    }

    public Candidate uploadVideo(Long candidateId, MultipartFile video) throws Exception {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + candidateId));

        if (video == null || video.isEmpty()) {
            throw new RuntimeException("Video file is missing");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String originalFileName = video.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "video.mp4";
        }

        String safeFileName = System.currentTimeMillis() + "_" +
                originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_");

        Path targetPath = uploadPath.resolve(safeFileName);

        video.transferTo(targetPath.toFile());

        candidate.setVideoPath(targetPath.toString());
        candidate.setStatus("VIDEO_SUBMITTED");

        return candidateRepository.save(candidate);
    }

    private String extractTextFromPdfSafely(File file) {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null) {
                return "";
            }

            return text;
        } catch (Exception e) {
            System.out.println("PDF text extraction failed: " + e.getMessage());
            return "";
        }
    }

    private ScreeningResult calculateScore(String resumeText, String requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return new ScreeningResult(0.0, "");
        }

        if (resumeText == null) {
            resumeText = "";
        }

        String lowerResumeText = resumeText.toLowerCase();
        String[] skills = requiredSkills.toLowerCase().split(",");

        int matchedCount = 0;
        List<String> matchedSkills = new ArrayList<>();

        for (String skill : skills) {
            String cleanSkill = skill.trim();

            if (!cleanSkill.isEmpty() && lowerResumeText.contains(cleanSkill)) {
                matchedCount++;
                matchedSkills.add(cleanSkill);
            }
        }

        double score = ((double) matchedCount / skills.length) * 100;

        return new ScreeningResult(score, String.join(", ", matchedSkills));
    }

    private static class ScreeningResult {
        double score;
        String matchedSkills;

        ScreeningResult(double score, String matchedSkills) {
            this.score = score;
            this.matchedSkills = matchedSkills;
        }
    }
}