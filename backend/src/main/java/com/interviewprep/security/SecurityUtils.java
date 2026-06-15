package com.interviewprep.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static UserDetailsImpl getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl user) {
            return user;
        }
        throw new IllegalStateException("No authenticated user");
    }

    public static String getCurrentUsername() {
        return getCurrentUser().getUsername();
    }
}
