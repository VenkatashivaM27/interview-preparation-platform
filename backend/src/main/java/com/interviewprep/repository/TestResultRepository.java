package com.interviewprep.repository;

import com.interviewprep.entity.TestResult;
import com.interviewprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserOrderByCreatedAtDesc(User user);
    long countByUser(User user);
}
