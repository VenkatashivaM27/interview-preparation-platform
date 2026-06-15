package com.interviewprep.service;

import com.interviewprep.entity.Analytics;
import com.interviewprep.entity.Resume;
import com.interviewprep.entity.User;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.repository.AnalyticsRepository;
import com.interviewprep.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AnalyticsRepository analyticsRepository;
    private final UserService userService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final Set<String> TECH_SKILLS = Set.of(
            "java", "python", "javascript", "react", "spring", "sql", "mysql",
            "docker", "kubernetes", "aws", "git", "html", "css", "node", "typescript",
            "angular", "vue", "mongodb", "redis", "microservices", "rest", "api"
    );

    @Transactional
    public Resume analyzeResume(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        String originalName = file.getOriginalFilename();
        if (originalName == null || !originalName.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF files are supported");
        }

        User user = userService.getCurrentUserEntity();
        Path uploadPath = Paths.get(uploadDir, "resumes");
        Files.createDirectories(uploadPath);
        String filename = UUID.randomUUID() + "_" + originalName;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String text = extractText(filePath);
        List<String> foundSkills = extractSkills(text);
        int score = calculateScore(foundSkills, text);
        String suggestions = generateSuggestions(foundSkills, score);
        String summary = generateSummary(foundSkills, score);

        Resume resume = Resume.builder()
                .user(user)
                .fileName(originalName)
                .filePath("/uploads/resumes/" + filename)
                .extractedSkills(String.join(", ", foundSkills))
                .score(score)
                .suggestions(suggestions)
                .analysisSummary(summary)
                .build();
        resume = resumeRepository.save(resume);

        analyticsRepository.save(Analytics.builder()
                .user(user)
                .activityType("RESUME_ANALYSIS")
                .details("Resume analyzed: " + originalName)
                .score(score)
                .category("RESUME")
                .build());

        return resume;
    }

    private String extractText(Path filePath) throws IOException {
        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private List<String> extractSkills(String text) {
        String lower = text.toLowerCase();
        return TECH_SKILLS.stream()
                .filter(lower::contains)
                .map(String::toUpperCase)
                .collect(Collectors.toList());
    }

    private int calculateScore(List<String> skills, String text) {
        int score = 40;
        score += Math.min(skills.size() * 8, 40);
        if (text.toLowerCase().contains("experience")) score += 5;
        if (text.toLowerCase().contains("education")) score += 5;
        if (text.toLowerCase().contains("project")) score += 5;
        if (text.length() > 500) score += 5;
        return Math.min(score, 100);
    }

    private String generateSuggestions(List<String> skills, int score) {
        List<String> suggestions = new ArrayList<>();
        if (skills.size() < 5) {
            suggestions.add("Add more technical skills relevant to your target role.");
        }
        if (score < 70) {
            suggestions.add("Include quantifiable achievements with metrics.");
        }
        suggestions.add("Use action verbs like 'developed', 'implemented', 'optimized'.");
        suggestions.add("Tailor your resume for each job application.");
        suggestions.add("Keep formatting clean and ATS-friendly.");
        return String.join("\n", suggestions);
    }

    private String generateSummary(List<String> skills, int score) {
        return String.format("Resume scored %d/100. Detected %d technical skills: %s",
                score, skills.size(),
                skills.isEmpty() ? "none detected" : String.join(", ", skills));
    }

    public List<Resume> getUserResumes() {
        return resumeRepository.findByUserOrderByCreatedAtDesc(userService.getCurrentUserEntity());
    }

    public Optional<Resume> getLatestResume() {
        return resumeRepository.findTopByUserOrderByCreatedAtDesc(userService.getCurrentUserEntity());
    }
}
