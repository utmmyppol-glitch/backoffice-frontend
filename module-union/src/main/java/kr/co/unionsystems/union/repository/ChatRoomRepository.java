package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository("unionChatRoomRepository")
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findBySessionId(String sessionId);

    List<ChatRoom> findByStatusInOrderByLastMessageAtDesc(List<ChatRoom.RoomStatus> statuses);

    List<ChatRoom> findAllByOrderByLastMessageAtDesc();

    long countByStatus(ChatRoom.RoomStatus status);
}
