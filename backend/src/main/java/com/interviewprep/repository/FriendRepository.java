package com.interviewprep.repository;

import com.interviewprep.entity.Friend;
import com.interviewprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUser(User user);
    boolean existsByUserAndFriend(User user, User friend);
    Optional<Friend> findByUserAndFriend(User user, User friend);
}
