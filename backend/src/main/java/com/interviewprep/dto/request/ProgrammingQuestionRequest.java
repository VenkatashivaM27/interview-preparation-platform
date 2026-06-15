package com.interviewprep.dto.request;

import com.interviewprep.entity.enums.SkillLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgrammingQuestionRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private SkillLevel difficulty;
    @NotBlank
    private String language;
    private String starterCode;
    private String testCases;
    private String expectedOutput;
    private Integer timeLimitSeconds;
    private Long skillTrackId;
}
