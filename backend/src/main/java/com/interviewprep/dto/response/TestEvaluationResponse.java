package com.interviewprep.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TestEvaluationResponse {
    private boolean passed;
    private int score;
    private int passedTests;
    private int totalTests;
    private String language;
    private String message;
    private List<TestCaseResult> results;

    @Data
    @Builder
    public static class TestCaseResult {
        private int index;
        private boolean passed;
        private String expected;
        private String actual;
    }
}
