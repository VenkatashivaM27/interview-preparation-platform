package com.interviewprep.service;

import com.interviewprep.entity.*;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.*;
import com.interviewprep.util.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final MockTestRepository mockTestRepository;
    private final ProgrammingQuestionRepository programmingQuestionRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final AnalyticsRepository analyticsRepository;
    private final AdminReportRepository adminReportRepository;
    private final GroupChatRepository groupChatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;

    public Map<String, Object> getDashboardStats() {
        userService.updateRanks();
        long totalStudents = userRepository.countStudents();
        long activeStudents = userRepository.countActiveStudents();
        long inactiveStudents = userRepository.countInactiveStudents();
        long participating = userRepository.countParticipatingStudents();
        long notParticipating = userRepository.countNonParticipatingStudents();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStudents", totalStudents);
        stats.put("activeUsers", userRepository.countByActiveTrue());
        stats.put("onlineUsers", userRepository.countByOnlineTrue());
        stats.put("totalMockInterviews", mockTestRepository.countByCompletedTrue());
        stats.put("totalProgrammingQuestions", programmingQuestionRepository.countByActiveTrue());
        stats.put("totalInterviewQuestions", interviewQuestionRepository.countByActiveTrue());

        stats.put("activeStudents", activeStudents);
        stats.put("inactiveStudents", inactiveStudents);
        stats.put("participatingStudents", participating);
        stats.put("nonParticipatingStudents", notParticipating);

        stats.put("studentStatusChart", List.of(
                Map.of("name", "Active", "value", activeStudents),
                Map.of("name", "Inactive", "value", inactiveStudents)
        ));
        stats.put("studentParticipationChart", List.of(
                Map.of("name", "Participating", "value", participating),
                Map.of("name", "Not Participating", "value", notParticipating)
        ));

        List<User> topStudents = userRepository.findTopStudentsByScore(PageRequest.of(0, 15));
        List<Map<String, Object>> studentLeaderboard = new java.util.ArrayList<>();
        for (int i = 0; i < topStudents.size(); i++) {
            User u = topStudents.get(i);
            Map<String, Object> row = new HashMap<>();
            row.put("rank", i + 1);
            row.put("userId", u.getId());
            row.put("username", u.getUsername());
            row.put("fullName", u.getFullName());
            row.put("totalScore", u.getTotalScore());
            row.put("active", u.getActive());
            studentLeaderboard.add(row);
        }
        stats.put("studentLeaderboard", studentLeaderboard);

        return stats;
    }

    public Page<User> getUsers(Pageable pageable, String search) {
        if (search != null && !search.isBlank()) {
            return userRepository
                    .findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
                            search, search, search, pageable);
        }
        return userRepository.findAll(pageable);
    }

    @Transactional
    public User toggleUserActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.getActive());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public Map<String, Object> getPlatformAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("recentActivity", analyticsRepository.findTop20ByOrderByCreatedAtDesc());
        analytics.put("reportedMessages", chatMessageRepository.findByReportedTrueOrderByCreatedAtDesc());
        return analytics;
    }

    public List<AdminReport> getReports() {
        return adminReportRepository.findByResolvedFalseOrderByCreatedAtDesc();
    }

    @Transactional
    public AdminReport resolveReport(Long reportId, String adminNotes) {
        AdminReport report = adminReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setResolved(true);
        report.setAdminNotes(adminNotes);
        return adminReportRepository.save(report);
    }

    public List<GroupChat> getAllGroups() {
        return groupChatRepository.findAll();
    }

    @Transactional
    public GroupChat deactivateGroup(Long groupId) {
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        group.setActive(false);
        return groupChatRepository.save(group);
    }

    public List<Map<String, Object>> getUsersSummary(Page<User> users) {
        return users.getContent().stream()
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("user", UserMapper.toResponse(u));
                    return m;
                })
                .collect(Collectors.toList());
    }
}
