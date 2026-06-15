package com.interviewprep.controller;

import com.interviewprep.dto.request.CodeSubmissionRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.TestEvaluationResponse;
import com.interviewprep.entity.ProgrammingQuestion;
import com.interviewprep.entity.TestResult;
import com.interviewprep.entity.enums.SkillLevel;
import com.interviewprep.service.ProgrammingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programming")
@RequiredArgsConstructor
public class ProgrammingController {

    private final ProgrammingService programmingService;

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<ProgrammingQuestion>>> getQuestions(
            @RequestParam SkillLevel level) {
        return ResponseEntity.ok(ApiResponse.success(programmingService.getQuestionsBySkill(level)));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<ProgrammingQuestion>> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(programmingService.getQuestion(id)));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<TestEvaluationResponse>> submit(
            @Valid @RequestBody CodeSubmissionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(programmingService.submitCode(request)));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<TestResult>>> getResults() {
        return ResponseEntity.ok(ApiResponse.success(programmingService.getUserResults()));
    }
}
