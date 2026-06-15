package com.interviewprep.service;

import com.interviewprep.entity.*;
import com.interviewprep.entity.enums.FriendRequestStatus;
import com.interviewprep.entity.enums.NotificationType;
import com.interviewprep.entity.enums.RoleName;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.FriendRepository;
import com.interviewprep.repository.FriendRequestRepository;
import com.interviewprep.repository.NotificationRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.util.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    private void ensureStudentOnly(User user) {
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);
        if (isAdmin) {
            throw new BadRequestException("Administrators cannot use friend or social features");
        }
    }

    @Transactional
    public FriendRequest sendFriendRequest(Long receiverId) {
        User sender = userService.getCurrentUserEntity();
        ensureStudentOnly(sender);
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (sender.getId().equals(receiverId)) {
            throw new BadRequestException("Cannot send friend request to yourself");
        }
        if (friendRepository.existsByUserAndFriend(sender, receiver)) {
            throw new BadRequestException("Already friends");
        }
        if (friendRequestRepository.existsBySenderAndReceiverAndStatus(sender, receiver, FriendRequestStatus.PENDING)) {
            throw new BadRequestException("Friend request already sent");
        }

        FriendRequest request = FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendRequestStatus.PENDING)
                .build();
        request = friendRequestRepository.save(request);

        notificationRepository.save(Notification.builder()
                .user(receiver)
                .type(NotificationType.FRIEND_REQUEST)
                .title("New Friend Request")
                .message(sender.getFullName() + " sent you a friend request")
                .referenceId(request.getId())
                .build());

        return request;
    }

    @Transactional
    public void acceptFriendRequest(Long requestId) {
        User currentUser = userService.getCurrentUserEntity();
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Not authorized");
        }

        request.setStatus(FriendRequestStatus.ACCEPTED);
        friendRequestRepository.save(request);

        friendRepository.save(Friend.builder().user(request.getSender()).friend(request.getReceiver()).build());
        friendRepository.save(Friend.builder().user(request.getReceiver()).friend(request.getSender()).build());

        notificationRepository.save(Notification.builder()
                .user(request.getSender())
                .type(NotificationType.FRIEND_ACCEPTED)
                .title("Friend Request Accepted")
                .message(currentUser.getFullName() + " accepted your friend request")
                .build());
    }

    @Transactional
    public void rejectFriendRequest(Long requestId) {
        User currentUser = userService.getCurrentUserEntity();
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Not authorized");
        }
        request.setStatus(FriendRequestStatus.REJECTED);
        friendRequestRepository.save(request);
    }

    public Map<String, Object> getFriendsData() {
        User user = userService.getCurrentUserEntity();
        ensureStudentOnly(user);
        List<Friend> friends = friendRepository.findByUser(user);
        List<FriendRequest> pending = friendRequestRepository
                .findByReceiverAndStatus(user, FriendRequestStatus.PENDING);

        Map<String, Object> data = new HashMap<>();
        data.put("friends", friends.stream()
                .map(f -> UserMapper.toResponse(f.getFriend()))
                .collect(Collectors.toList()));
        data.put("pendingRequests", pending);
        return data;
    }
}
