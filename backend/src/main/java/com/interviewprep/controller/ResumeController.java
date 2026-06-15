package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.entity.Resume;
import com.interviewprep.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<Resume>> analyze(@RequestParam("file") MultipartFile file)
            throws IOException {
        return ResponseEntity.ok(ApiResponse.success(resumeService.analyzeResume(file)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Resume>>> getResumes() {
        return ResponseEntity.ok(ApiResponse.success(resumeService.getUserResumes()));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<Resume>> getLatest() {
        return resumeService.getLatestResume()
                .map(r -> ResponseEntity.ok(ApiResponse.success(r)))
                .orElse(ResponseEntity.ok(ApiResponse.success(null)));
    }
}
