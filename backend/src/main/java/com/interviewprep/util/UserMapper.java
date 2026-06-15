package com.interviewprep.util;

import com.interviewprep.dto.response.UserResponse;
import com.interviewprep.entity.User;
import com.interviewprep.entity.enums.RoleName;

import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {}

    public static boolean isAdminUser(User user) {
        return user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);
    }

    public static UserResponse toResponse(User user) {
        boolean isAdmin = isAdminUser(user);
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .skills(user.getSkills())
                .interests(user.getInterests())
                .skillLevel(user.getSkillLevel())
                .active(user.getActive())
                .online(user.getOnline())
                .totalScore(user.getTotalScore())
                .rank(isAdmin ? null : user.getRank())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toList()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
