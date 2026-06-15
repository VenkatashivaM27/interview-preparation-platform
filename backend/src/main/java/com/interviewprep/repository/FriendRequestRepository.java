package com.interviewprep.repository;

import com.interviewprep.entity.FriendRequest;
import com.interviewprep.entity.User;
import com.interviewprep.entity.enums.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequestStatus status);
    List<FriendRequest> findBySenderAndStatus(User sender, FriendRequestStatus status);
    Optional<FriendRequest> findBySenderAndReceiverAndStatus(User sender, User receiver, FriendRequestStatus status);
    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, FriendRequestStatus status);
}
