package com.interviewprep.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long receiverId;
    private Long groupId;
    @NotBlank
    private String content;
}
