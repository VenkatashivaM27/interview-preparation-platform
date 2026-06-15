package com.interviewprep.dto.request;

import com.interviewprep.entity.enums.QuestionType;
import com.interviewprep.entity.enums.SkillLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewQuestionRequest {
    @NotBlank
    private String question;
    @NotNull
    private QuestionType type;
    @NotNull
    private SkillLevel difficulty;
    private String sampleAnswer;
    private Integer timeLimitSeconds;
    private Long skillTrackId;
}
