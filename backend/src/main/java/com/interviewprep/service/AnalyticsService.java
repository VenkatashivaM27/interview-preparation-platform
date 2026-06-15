package com.interviewprep.service;

import com.interviewprep.entity.Analytics;
import com.interviewprep.entity.TestResult;
import com.interviewprep.entity.User;
import com.interviewprep.repository.AnalyticsRepository;
import com.interviewprep.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final TestResultRepository testResultRepository;
    private final UserService userService;

    public Map<String, Object> getUserAnalytics() {
        User user = userService.getCurrentUserEntity();
        List<TestResult> results = testResultRepository.findByUserOrderByCreatedAtDesc(user);
        List<Analytics> activities = analyticsRepository.findByUserOrderByCreatedAtDesc(user);

        Map<String, Long> activityByType = activities.stream()
                .collect(Collectors.groupingBy(Analytics::getActivityType, Collectors.counting()));

        Map<String, Double> scoreByCategory = results.stream()
                .filter(r -> r.getQuestion() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getQuestion().getDifficulty().name(),
                        Collectors.averagingInt(TestResult::getScore)
                ));

        List<Map<String, Object>> progressData = results.stream()
                .limit(10)
                .map(r -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("date", r.getCreatedAt() != null ? r.getCreatedAt().toLocalDate().toString() : "");
                    item.put("score", r.getScore());
                    item.put("passed", r.getPassed());
                    return item;
                })
                .collect(Collectors.toList());

        List<String> strongAreas = scoreByCategory.entrySet().stream()
                .filter(e -> e.getValue() >= 70)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        List<String> weakAreas = scoreByCategory.entrySet().stream()
                .filter(e -> e.getValue() < 70)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("totalTests", results.size());
        response.put("averageScore", results.stream().mapToInt(TestResult::getScore).average().orElse(0));
        response.put("activityByType", activityByType);
        response.put("scoreByCategory", scoreByCategory);
        response.put("progressData", progressData);
        response.put("strongAreas", strongAreas);
        response.put("weakAreas", weakAreas);
        response.put("recentActivities", activities.stream().limit(20).collect(Collectors.toList()));
        return response;
    }
}
