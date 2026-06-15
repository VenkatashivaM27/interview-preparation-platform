package com.interviewprep.dto.response;

import com.interviewprep.entity.enums.SkillLevel;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String profilePicture;
    private String skills;
    private String interests;
    private SkillLevel skillLevel;
    private Boolean active;
    private Boolean online;
    private Integer totalScore;
    private Integer rank;
    private List<String> roles;
    private LocalDateTime createdAt;
}
