package com.interviewprep.repository;

import com.interviewprep.entity.ProgrammingQuestion;
import com.interviewprep.entity.enums.SkillLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammingQuestionRepository extends JpaRepository<ProgrammingQuestion, Long> {
    List<ProgrammingQuestion> findByDifficultyAndActiveTrue(SkillLevel difficulty);
    Page<ProgrammingQuestion> findByDifficultyAndActiveTrue(SkillLevel difficulty, Pageable pageable);
    Page<ProgrammingQuestion> findByActiveTrue(Pageable pageable);
    long countByActiveTrue();
}
