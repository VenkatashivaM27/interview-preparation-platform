package com.interviewprep.service;

import com.interviewprep.dto.request.InterviewQuestionRequest;
import com.interviewprep.entity.*;
import com.interviewprep.entity.SkillTrack;
import com.interviewprep.entity.enums.QuestionType;
import com.interviewprep.entity.enums.SkillLevel;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.AnalyticsRepository;
import com.interviewprep.repository.InterviewQuestionRepository;
import com.interviewprep.repository.MockTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewQuestionRepository questionRepository;
    private final MockTestRepository mockTestRepository;
    private final AnalyticsRepository analyticsRepository;
    private final UserService userService;
    private final SkillTrackService skillTrackService;

    public Map<String, Object> startMockInterview(SkillLevel level) {
        User user = userService.getCurrentUserEntity();
        SkillLevel skill = level != null ? level : (user.getSkillLevel() != null ? user.getSkillLevel() : SkillLevel.BEGINNER);

        List<InterviewQuestion> technical = questionRepository
                .findByTypeAndDifficultyAndActiveTrue(QuestionType.TECHNICAL, skill);
        List<InterviewQuestion> hr = questionRepository
                .findByTypeAndDifficultyAndActiveTrue(QuestionType.HR, skill);

        if (technical.isEmpty()) {
            technical = questionRepository.findByDifficultyAndActiveTrue(skill);
        }

        Collections.shuffle(technical);
        Collections.shuffle(hr);

        List<InterviewQuestion> selected = new ArrayList<>();
        selected.addAll(technical.stream().limit(3).toList());
        selected.addAll(hr.stream().limit(2).toList());

        String questionIds = selected.stream()
                .map(q -> String.valueOf(q.getId()))
                .collect(Collectors.joining(","));

        MockTest mockTest = MockTest.builder()
                .user(user)
                .skillLevel(skill)
                .questionIds(questionIds)
                .totalQuestions(selected.size())
                .completed(false)
                .build();
        mockTest = mockTestRepository.save(mockTest);

        Map<String, Object> response = new HashMap<>();
        response.put("mockTestId", mockTest.getId());
        response.put("questions", selected);
        response.put("totalQuestions", selected.size());
        response.put("timeLimitSeconds", 1800);
        return response;
    }

    @Transactional
    public MockTest completeMockInterview(Long mockTestId, int score, int timeTakenSeconds) {
        MockTest mockTest = mockTestRepository.findById(mockTestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mock test not found"));
        mockTest.setScore(score);
        mockTest.setTimeTakenSeconds(timeTakenSeconds);
        mockTest.setCompleted(true);
        mockTest.setCompletedAt(LocalDateTime.now());
        mockTestRepository.save(mockTest);

        User user = mockTest.getUser();
        user.setTotalScore(user.getTotalScore() + score);
        userService.updateRanks();

        analyticsRepository.save(Analytics.builder()
                .user(user)
                .activityType("MOCK_INTERVIEW")
                .details("Mock interview completed")
                .score(score)
                .category(mockTest.getSkillLevel().name())
                .build());

        return mockTest;
    }

    public List<MockTest> getUserMockTests() {
        return mockTestRepository.findByUserOrderByCreatedAtDesc(userService.getCurrentUserEntity());
    }

    @Transactional
    public InterviewQuestion createQuestion(InterviewQuestionRequest request) {
        InterviewQuestion q = InterviewQuestion.builder()
                .question(request.getQuestion())
                .type(request.getType())
                .difficulty(request.getDifficulty())
                .sampleAnswer(request.getSampleAnswer())
                .timeLimitSeconds(request.getTimeLimitSeconds() != null ? request.getTimeLimitSeconds() : 120)
                .skillTrack(resolveSkillTrack(request.getSkillTrackId()))
                .active(true)
                .build();
        return questionRepository.save(q);
    }

    @Transactional
    public InterviewQuestion updateQuestion(Long id, InterviewQuestionRequest request) {
        InterviewQuestion q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        q.setQuestion(request.getQuestion());
        q.setType(request.getType());
        q.setDifficulty(request.getDifficulty());
        q.setSampleAnswer(request.getSampleAnswer());
        if (request.getTimeLimitSeconds() != null) q.setTimeLimitSeconds(request.getTimeLimitSeconds());
        q.setSkillTrack(resolveSkillTrack(request.getSkillTrackId()));
        return questionRepository.save(q);
    }

    private SkillTrack resolveSkillTrack(Long skillTrackId) {
        if (skillTrackId == null) return null;
        return skillTrackService.getById(skillTrackId);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        InterviewQuestion q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        q.setActive(false);
        questionRepository.save(q);
    }

    public List<InterviewQuestion> getAllQuestions() {
        return questionRepository.findAll();
    }
}
