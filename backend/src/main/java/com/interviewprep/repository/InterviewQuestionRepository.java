package com.interviewprep.repository;

import com.interviewprep.entity.InterviewQuestion;
import com.interviewprep.entity.enums.QuestionType;
import com.interviewprep.entity.enums.SkillLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByTypeAndDifficultyAndActiveTrue(QuestionType type, SkillLevel difficulty);
    List<InterviewQuestion> findByDifficultyAndActiveTrue(SkillLevel difficulty);
    long countByActiveTrue();
}
