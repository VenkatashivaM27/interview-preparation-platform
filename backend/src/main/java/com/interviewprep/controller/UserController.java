package com.interviewprep.controller;

import com.interviewprep.dto.request.PasswordChangeRequest;
import com.interviewprep.dto.request.ProfileUpdateRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.DashboardResponse;
import com.interviewprep.dto.response.UserResponse;
import com.interviewprep.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(userService.getDashboard()));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(request)));
    }

    @PostMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password updated", null));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(@RequestParam("file") MultipartFile file)
            throws IOException {
        return ResponseEntity.ok(ApiResponse.success(userService.uploadProfilePicture(file)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> search(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(userService.searchUsers(q)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }
}
