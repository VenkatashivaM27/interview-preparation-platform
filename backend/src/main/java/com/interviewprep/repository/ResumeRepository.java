package com.interviewprep.repository;

import com.interviewprep.entity.Resume;
import com.interviewprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByCreatedAtDesc(User user);
    Optional<Resume> findTopByUserOrderByCreatedAtDesc(User user);
}
