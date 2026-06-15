package com.interviewprep.controller;

import com.interviewprep.dto.request.ChatMessageRequest;
import com.interviewprep.dto.request.GroupChatRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.entity.AdminReport;
import com.interviewprep.entity.ChatMessage;
import com.interviewprep.entity.GroupChat;
import com.interviewprep.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatMessage>> send(@Valid @RequestBody ChatMessageRequest request) {
        return ResponseEntity.ok(ApiResponse.success(chatService.sendMessage(request)));
    }

    @GetMapping("/private/{friendId}")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getPrivate(@PathVariable Long friendId) {
        return ResponseEntity.ok(ApiResponse.success(chatService.getPrivateMessages(friendId)));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(ApiResponse.success(chatService.getGroupMessages(groupId)));
    }

    @PostMapping("/groups")
    public ResponseEntity<ApiResponse<GroupChat>> createGroup(@Valid @RequestBody GroupChatRequest request) {
        return ResponseEntity.ok(ApiResponse.success(chatService.createGroup(request)));
    }

    @PostMapping("/groups/{groupId}/join")
    public ResponseEntity<ApiResponse<GroupChat>> joinGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(ApiResponse.success(chatService.joinGroup(groupId)));
    }

    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<List<GroupChat>>> getGroups() {
        return ResponseEntity.ok(ApiResponse.success(chatService.getUserGroups()));
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> overview() {
        return ResponseEntity.ok(ApiResponse.success(chatService.getChatOverview()));
    }

    @PostMapping("/report/{messageId}")
    public ResponseEntity<ApiResponse<AdminReport>> report(
            @PathVariable Long messageId,
            @RequestParam String reason) {
        return ResponseEntity.ok(ApiResponse.success(chatService.reportMessage(messageId, reason)));
    }
}
