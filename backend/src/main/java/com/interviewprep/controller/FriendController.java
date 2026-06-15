package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.entity.FriendRequest;
import com.interviewprep.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFriends() {
        return ResponseEntity.ok(ApiResponse.success(friendService.getFriendsData()));
    }

    @PostMapping("/request/{userId}")
    public ResponseEntity<ApiResponse<FriendRequest>> sendRequest(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(friendService.sendFriendRequest(userId)));
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<ApiResponse<Void>> accept(@PathVariable Long requestId) {
        friendService.acceptFriendRequest(requestId);
        return ResponseEntity.ok(ApiResponse.success("Accepted", null));
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<ApiResponse<Void>> reject(@PathVariable Long requestId) {
        friendService.rejectFriendRequest(requestId);
        return ResponseEntity.ok(ApiResponse.success("Rejected", null));
    }
}
