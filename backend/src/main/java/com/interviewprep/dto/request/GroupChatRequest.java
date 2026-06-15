package com.interviewprep.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GroupChatRequest {
    @NotBlank
    private String name;
    private String description;
}
