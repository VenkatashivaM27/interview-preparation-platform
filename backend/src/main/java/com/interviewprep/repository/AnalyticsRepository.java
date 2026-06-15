package com.interviewprep.repository;

import com.interviewprep.entity.Analytics;
import com.interviewprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    List<Analytics> findByUserOrderByCreatedAtDesc(User user);
    List<Analytics> findTop20ByOrderByCreatedAtDesc();
}
