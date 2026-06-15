package com.interviewprep.service;

import com.interviewprep.entity.Notification;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public List<Notification> getUserNotifications() {
        return notificationRepository.findByUserOrderByCreatedAtDesc(userService.getCurrentUserEntity());
    }

    public long getUnreadCount() {
        return notificationRepository.countByUserAndReadFalse(userService.getCurrentUserEntity());
    }

    @Transactional
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        notificationRepository.findByUserOrderByCreatedAtDesc(userService.getCurrentUserEntity())
                .forEach(n -> {
                    n.setRead(true);
                    notificationRepository.save(n);
                });
    }
}
