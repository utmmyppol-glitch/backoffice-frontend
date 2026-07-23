package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository("unionChatMessageRepository")
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(Long roomId);
}
