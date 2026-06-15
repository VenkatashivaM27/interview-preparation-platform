package com.interviewprep.repository;

import com.interviewprep.entity.AdminReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminReportRepository extends JpaRepository<AdminReport, Long> {
    List<AdminReport> findByResolvedFalseOrderByCreatedAtDesc();
    List<AdminReport> findAllByOrderByCreatedAtDesc();
}
