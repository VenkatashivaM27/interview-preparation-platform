package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.entity.SkillTrack;
import com.interviewprep.service.SkillTrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillTrackController {

    private final SkillTrackService skillTrackService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillTrack>>> list() {
        return ResponseEntity.ok(ApiResponse.success(skillTrackService.getAllActive()));
    }
}
