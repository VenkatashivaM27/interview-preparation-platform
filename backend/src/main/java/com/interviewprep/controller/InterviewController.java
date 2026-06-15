package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.entity.MockTest;
import com.interviewprep.entity.enums.SkillLevel;
import com.interviewprep.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/mock/start")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startMock(
            @RequestParam(required = false) SkillLevel level) {
        return ResponseEntity.ok(ApiResponse.success(interviewService.startMockInterview(level)));
    }

    @PostMapping("/mock/{id}/complete")
    public ResponseEntity<ApiResponse<MockTest>> completeMock(
            @PathVariable Long id,
            @RequestParam int score,
            @RequestParam int timeTakenSeconds) {
        return ResponseEntity.ok(ApiResponse.success(
                interviewService.completeMockInterview(id, score, timeTakenSeconds)));
    }

    @GetMapping("/mock/history")
    public ResponseEntity<ApiResponse<List<MockTest>>> getHistory() {
        return ResponseEntity.ok(ApiResponse.success(interviewService.getUserMockTests()));
    }
}
