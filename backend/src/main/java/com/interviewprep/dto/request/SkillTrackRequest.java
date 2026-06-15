package com.interviewprep.dto.request;

import com.interviewprep.entity.enums.SkillLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SkillTrackRequest {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private SkillLevel level;
    private String category;
}
