package com.interviewprep.service;

import com.interviewprep.dto.request.ChatMessageRequest;
import com.interviewprep.dto.request.GroupChatRequest;
import com.interviewprep.entity.*;
import com.interviewprep.entity.enums.NotificationType;
import com.interviewprep.entity.enums.RoleName;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final GroupChatRepository groupChatRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final AdminReportRepository adminReportRepository;
    private final UserService userService;

    private void ensureStudentOnly(User user) {
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);
        if (isAdmin) {
            throw new BadRequestException("Administrators cannot use chat or social features");
        }
    }

    @Transactional
    public ChatMessage sendMessage(ChatMessageRequest request) {
        User sender = userService.getCurrentUserEntity();
        ensureStudentOnly(sender);
        ChatMessage message;

        if (request.getGroupId() != null) {
            GroupChat group = groupChatRepository.findById(request.getGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
            if (!group.getMembers().contains(sender)) {
                throw new BadRequestException("Not a member of this group");
            }
            message = ChatMessage.builder()
                    .sender(sender)
                    .group(group)
                    .content(request.getContent())
                    .build();
            group.getMembers().stream()
                    .filter(m -> !m.getId().equals(sender.getId()))
                    .forEach(m -> notificationRepository.save(Notification.builder()
                            .user(m)
                            .type(NotificationType.MESSAGE)
                            .title("New group message")
                            .message(sender.getUsername() + ": " + truncate(request.getContent()))
                            .referenceId(group.getId())
                            .build()));
        } else if (request.getReceiverId() != null) {
            User receiver = userRepository.findById(request.getReceiverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));
            message = ChatMessage.builder()
                    .sender(sender)
                    .receiver(receiver)
                    .content(request.getContent())
                    .build();
            notificationRepository.save(Notification.builder()
                    .user(receiver)
                    .type(NotificationType.MESSAGE)
                    .title("New message from " + sender.getUsername())
                    .message(truncate(request.getContent()))
                    .referenceId(sender.getId())
                    .build());
        } else {
            throw new BadRequestException("Receiver or group required");
        }

        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getPrivateMessages(Long friendId) {
        User user = userService.getCurrentUserEntity();
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return chatMessageRepository
                .findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(
                        user, friend, friend, user);
    }

    public List<ChatMessage> getGroupMessages(Long groupId) {
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        return chatMessageRepository.findByGroupOrderByCreatedAtAsc(group);
    }

    @Transactional
    public GroupChat createGroup(GroupChatRequest request) {
        User creator = userService.getCurrentUserEntity();
        ensureStudentOnly(creator);
        GroupChat group = GroupChat.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(creator)
                .active(true)
                .build();
        group.getMembers().add(creator);
        return groupChatRepository.save(group);
    }

    @Transactional
    public GroupChat joinGroup(Long groupId) {
        User user = userService.getCurrentUserEntity();
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        group.getMembers().add(user);
        return groupChatRepository.save(group);
    }

    public List<GroupChat> getUserGroups() {
        return groupChatRepository.findByMember(userService.getCurrentUserEntity());
    }

    @Transactional
    public AdminReport reportMessage(Long messageId, String reason) {
        User reporter = userService.getCurrentUserEntity();
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        message.setReported(true);
        chatMessageRepository.save(message);
        return adminReportRepository.save(AdminReport.builder()
                .reporter(reporter)
                .message(message)
                .reason(reason)
                .resolved(false)
                .build());
    }

    public Map<String, Object> getChatOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("groups", getUserGroups());
        return overview;
    }

    private String truncate(String content) {
        return content.length() > 50 ? content.substring(0, 47) + "..." : content;
    }
}
