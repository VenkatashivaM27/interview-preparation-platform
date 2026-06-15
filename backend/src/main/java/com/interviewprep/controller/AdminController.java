package com.interviewprep.controller;

import com.interviewprep.dto.request.InterviewQuestionRequest;
import com.interviewprep.dto.request.ProgrammingQuestionRequest;
import com.interviewprep.dto.request.SkillTrackRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.entity.*;
import com.interviewprep.service.AdminService;
import com.interviewprep.service.InterviewService;
import com.interviewprep.service.ProgrammingService;
import com.interviewprep.service.SkillTrackService;
import com.interviewprep.util.UserMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ProgrammingService programmingService;
    private final InterviewService interviewService;
    private final SkillTrackService skillTrackService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> users(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Page<User> users = adminService.getUsers(PageRequest.of(page, size), search);
        Map<String, Object> result = new HashMap<>();
        result.put("content", users.getContent().stream().map(UserMapper::toResponse).toList());
        result.put("totalPages", users.getTotalPages());
        result.put("totalElements", users.getTotalElements());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/users/{id}/toggle-active")
    public ResponseEntity<ApiResponse<User>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.toggleUserActive(id)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillTrack>>> getSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillTrackService.getAll()));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<SkillTrack>> createSkill(@Valid @RequestBody SkillTrackRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillTrackService.create(request)));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<SkillTrack>> updateSkill(
            @PathVariable Long id, @Valid @RequestBody SkillTrackRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillTrackService.update(id, request)));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        skillTrackService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted", null));
    }

    @GetMapping("/programming-questions")
    public ResponseEntity<ApiResponse<Page<ProgrammingQuestion>>> getProgrammingQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                programmingService.getAllQuestions(PageRequest.of(page, size))));
    }

    @PostMapping("/programming-questions")
    public ResponseEntity<ApiResponse<ProgrammingQuestion>> createProgramming(
            @Valid @RequestBody ProgrammingQuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(programmingService.createQuestion(request)));
    }

    @PutMapping("/programming-questions/{id}")
    public ResponseEntity<ApiResponse<ProgrammingQuestion>> updateProgramming(
            @PathVariable Long id, @Valid @RequestBody ProgrammingQuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(programmingService.updateQuestion(id, request)));
    }

    @DeleteMapping("/programming-questions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProgramming(@PathVariable Long id) {
        programmingService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    @GetMapping("/interview-questions")
    public ResponseEntity<ApiResponse<List<InterviewQuestion>>> getInterviewQuestions() {
        return ResponseEntity.ok(ApiResponse.success(interviewService.getAllQuestions()));
    }

    @PostMapping("/interview-questions")
    public ResponseEntity<ApiResponse<InterviewQuestion>> createInterview(
            @Valid @RequestBody InterviewQuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(interviewService.createQuestion(request)));
    }

    @PutMapping("/interview-questions/{id}")
    public ResponseEntity<ApiResponse<InterviewQuestion>> updateInterview(
            @PathVariable Long id, @Valid @RequestBody InterviewQuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(interviewService.updateQuestion(id, request)));
    }

    @DeleteMapping("/interview-questions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInterview(@PathVariable Long id) {
        interviewService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analytics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPlatformAnalytics()));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<AdminReport>>> reports() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getReports()));
    }

    @PatchMapping("/reports/{id}/resolve")
    public ResponseEntity<ApiResponse<AdminReport>> resolveReport(
            @PathVariable Long id, @RequestParam String notes) {
        return ResponseEntity.ok(ApiResponse.success(adminService.resolveReport(id, notes)));
    }

    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<List<GroupChat>>> groups() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllGroups()));
    }

    @PatchMapping("/groups/{id}/deactivate")
    public ResponseEntity<ApiResponse<GroupChat>> deactivateGroup(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.deactivateGroup(id)));
    }
}
