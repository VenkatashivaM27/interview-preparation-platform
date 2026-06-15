package com.interviewprep.repository;

import com.interviewprep.entity.GroupChat;
import com.interviewprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupChatRepository extends JpaRepository<GroupChat, Long> {
    @Query("SELECT g FROM GroupChat g JOIN g.members m WHERE m = :user AND g.active = true")
    List<GroupChat> findByMember(User user);
}
