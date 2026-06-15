package com.interviewprep.service;

import com.interviewprep.dto.request.PasswordChangeRequest;
import com.interviewprep.dto.request.ProfileUpdateRequest;
import com.interviewprep.dto.response.DashboardResponse;
import com.interviewprep.dto.response.UserResponse;
import com.interviewprep.entity.Analytics;
import com.interviewprep.entity.MockTest;
import com.interviewprep.entity.TestResult;
import com.interviewprep.entity.User;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.*;
import com.interviewprep.security.SecurityUtils;
import com.interviewprep.util.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TestResultRepository testResultRepository;
    private final MockTestRepository mockTestRepository;
    private final AnalyticsRepository analyticsRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public User getCurrentUserEntity() {
        return userRepository.findByUsername(SecurityUtils.getCurrentUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse getProfile() {
        return UserMapper.toResponse(getCurrentUserEntity());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUserEntity();
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getInterests() != null) user.setInterests(request.getInterests());
        if (request.getSkillLevel() != null) user.setSkillLevel(request.getSkillLevel());
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User user = getCurrentUserEntity();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserResponse uploadProfilePicture(MultipartFile file) throws IOException {
        User user = getCurrentUserEntity();
        Path uploadPath = Paths.get(uploadDir, "profiles");
        Files.createDirectories(uploadPath);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        user.setProfilePicture("/uploads/profiles/" + filename);
        return UserMapper.toResponse(userRepository.save(user));
    }

    public DashboardResponse getDashboard() {
        User user = getCurrentUserEntity();
        List<TestResult> results = testResultRepository.findByUserOrderByCreatedAtDesc(user);
        List<MockTest> mocks = mockTestRepository.findByUserOrderByCreatedAtDesc(user);
        List<Analytics> activities = analyticsRepository.findByUserOrderByCreatedAtDesc(user);

        double avgScore = results.isEmpty() ? 0 :
                results.stream().mapToInt(r -> r.getScore()).average().orElse(0);

        List<DashboardResponse.ActivityItem> recentActivity = activities.stream()
                .limit(10)
                .map(a -> DashboardResponse.ActivityItem.builder()
                        .type(a.getActivityType())
                        .details(a.getDetails())
                        .score(a.getScore())
                        .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : "")
                        .build())
                .collect(Collectors.toList());

        List<User> topUsers = userRepository.findTopStudentsByScore(PageRequest.of(0, 10));
        List<DashboardResponse.LeaderboardItem> leaderboard = new java.util.ArrayList<>();
        for (int i = 0; i < topUsers.size(); i++) {
            User u = topUsers.get(i);
            leaderboard.add(DashboardResponse.LeaderboardItem.builder()
                    .userId(u.getId())
                    .username(u.getUsername())
                    .fullName(u.getFullName())
                    .totalScore(u.getTotalScore())
                    .rank(i + 1)
                    .build());
        }

        updateRanks();

        return DashboardResponse.builder()
                .totalScore(user.getTotalScore())
                .rank(user.getRank())
                .testsCompleted((long) results.size())
                .mockInterviewsCompleted(mocks.stream().filter(MockTest::getCompleted).count())
                .averageScore(avgScore)
                .recentActivity(recentActivity)
                .leaderboard(leaderboard)
                .build();
    }

    @Transactional
    public void updateRanks() {
        List<User> users = userRepository.findTopStudentsByScore(PageRequest.of(0, 1000));
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            u.setRank(i + 1);
            userRepository.save(u);
        }
    }

    public List<UserResponse> searchUsers(String query) {
        return userRepository
                .findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
                        query, query, query, PageRequest.of(0, 20))
                .getContent()
                .stream()
                .map(UserMapper::toResponse)
                .collect(Collectors.toList());
    }
}
