package com.interviewprep.repository;

import com.interviewprep.entity.ChatMessage;
import com.interviewprep.entity.GroupChat;
import com.interviewprep.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(
            User sender1, User receiver1, User sender2, User receiver2);
    List<ChatMessage> findByGroupOrderByCreatedAtAsc(GroupChat group);
    List<ChatMessage> findByReportedTrueOrderByCreatedAtDesc();
}
