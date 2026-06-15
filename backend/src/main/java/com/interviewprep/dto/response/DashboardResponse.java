package com.interviewprep.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private Integer totalScore;
    private Integer rank;
    private Long testsCompleted;
    private Long mockInterviewsCompleted;
    private Double averageScore;
    private List<ActivityItem> recentActivity;
    private List<LeaderboardItem> leaderboard;

    @Data
    @Builder
    public static class ActivityItem {
        private String type;
        private String details;
        private Integer score;
        private String createdAt;
    }

    @Data
    @Builder
    public static class LeaderboardItem {
        private Long userId;
        private String username;
        private String fullName;
        private Integer totalScore;
        private Integer rank;
    }
}
