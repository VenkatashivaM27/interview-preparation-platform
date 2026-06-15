package com.interviewprep.service;

import com.interviewprep.dto.request.CodeSubmissionRequest;
import com.interviewprep.dto.request.ProgrammingQuestionRequest;
import com.interviewprep.dto.response.TestEvaluationResponse;
import com.interviewprep.entity.Analytics;
import com.interviewprep.entity.ProgrammingQuestion;
import com.interviewprep.entity.SkillTrack;
import com.interviewprep.entity.TestResult;
import com.interviewprep.entity.User;
import com.interviewprep.entity.enums.SkillLevel;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.AnalyticsRepository;
import com.interviewprep.repository.ProgrammingQuestionRepository;
import com.interviewprep.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgrammingService {

    private final ProgrammingQuestionRepository questionRepository;
    private final TestResultRepository testResultRepository;
    private final AnalyticsRepository analyticsRepository;
    private final UserService userService;
    private final CodeEvaluationService codeEvaluationService;
    private final SkillTrackService skillTrackService;

    public List<ProgrammingQuestion> getQuestionsBySkill(SkillLevel level) {
        List<ProgrammingQuestion> questions = questionRepository.findByDifficultyAndActiveTrue(level);
        if (questions.isEmpty()) {
            return questionRepository.findAll().stream()
                    .filter(ProgrammingQuestion::getActive)
                    .collect(Collectors.toList());
        }
        Collections.shuffle(questions);
        return questions.stream().limit(5).collect(Collectors.toList());
    }

    public ProgrammingQuestion getQuestion(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }

    public Page<ProgrammingQuestion> getAllQuestions(Pageable pageable) {
        return questionRepository.findByActiveTrue(pageable);
    }

    @Transactional
    public TestEvaluationResponse submitCode(CodeSubmissionRequest request) {
        User user = userService.getCurrentUserEntity();
        ProgrammingQuestion question = getQuestion(request.getQuestionId());
        TestEvaluationResponse evaluation = codeEvaluationService.evaluate(request.getCode(), question, request.getLanguage());

        TestResult result = TestResult.builder()
                .user(user)
                .question(question)
                .submittedCode(request.getCode())
                .language(evaluation.getLanguage())
                .score(evaluation.getScore())
                .passedTests(evaluation.getPassedTests())
                .totalTests(evaluation.getTotalTests())
                .passed(evaluation.isPassed())
                .timeTakenSeconds(request.getTimeTakenSeconds())
                .build();
        testResultRepository.save(result);

        user.setTotalScore(user.getTotalScore() + evaluation.getScore());
        userService.updateRanks();

        analyticsRepository.save(Analytics.builder()
                .user(user)
                .activityType("CODING_TEST")
                .details("Completed: " + question.getTitle() + " in " + evaluation.getLanguage())
                .score(evaluation.getScore())
                .category(question.getDifficulty().name())
                .build());

        return evaluation;
    }

    @Transactional
    public ProgrammingQuestion createQuestion(ProgrammingQuestionRequest request) {
        ProgrammingQuestion q = ProgrammingQuestion.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .difficulty(request.getDifficulty())
                .language(request.getLanguage())
                .starterCode(request.getStarterCode())
                .testCases(request.getTestCases())
                .expectedOutput(request.getExpectedOutput())
                .timeLimitSeconds(request.getTimeLimitSeconds() != null ? request.getTimeLimitSeconds() : 300)
                .skillTrack(resolveSkillTrack(request.getSkillTrackId()))
                .active(true)
                .build();
        return questionRepository.save(q);
    }

    @Transactional
    public ProgrammingQuestion updateQuestion(Long id, ProgrammingQuestionRequest request) {
        ProgrammingQuestion q = getQuestion(id);
        q.setTitle(request.getTitle());
        q.setDescription(request.getDescription());
        q.setDifficulty(request.getDifficulty());
        q.setLanguage(request.getLanguage());
        q.setStarterCode(request.getStarterCode());
        q.setTestCases(request.getTestCases());
        q.setExpectedOutput(request.getExpectedOutput());
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
        ProgrammingQuestion q = getQuestion(id);
        q.setActive(false);
        questionRepository.save(q);
    }

    public List<TestResult> getUserResults() {
        return testResultRepository.findByUserOrderByCreatedAtDesc(userService.getCurrentUserEntity());
    }
}
