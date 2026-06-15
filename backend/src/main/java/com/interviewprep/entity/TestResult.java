package com.interviewprep.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private ProgrammingQuestion question;

    @Column(name = "submitted_code", columnDefinition = "TEXT")
    private String submittedCode;

    @Column(length = 50)
    private String language;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    @Column(name = "passed_tests")
    @Builder.Default
    private Integer passedTests = 0;

    @Column(name = "total_tests")
    @Builder.Default
    private Integer totalTests = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean passed = false;

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
