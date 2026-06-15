package com.interviewprep.dto.request;

import com.interviewprep.entity.enums.SkillLevel;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String bio;
    private String skills;
    private String interests;
    private SkillLevel skillLevel;
}
