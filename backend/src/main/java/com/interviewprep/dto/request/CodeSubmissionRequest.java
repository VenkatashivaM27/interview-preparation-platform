package com.interviewprep.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CodeSubmissionRequest {
    @NotNull
    private Long questionId;
    @NotBlank
    private String code;
    private String language;
    private Integer timeTakenSeconds;
}
