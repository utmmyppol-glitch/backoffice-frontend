package kr.co.unionsystems.union.service;

import kr.co.unionsystems.union.dto.ChatMessageDto;
import kr.co.unionsystems.union.dto.ChatRoomDto;
import kr.co.unionsystems.union.entity.ChatMessage;
import kr.co.unionsystems.union.entity.ChatRoom;
import kr.co.unionsystems.union.repository.ChatMessageRepository;
import kr.co.unionsystems.union.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service("unionChatService")
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository roomRepo;
    private final ChatMessageRepository msgRepo;

    /** 세션 ID로 채팅방 조회 또는 새로 생성 */
    @Transactional
    public ChatRoom getOrCreateRoom(String sessionId, String visitorName) {
        return roomRepo.findBySessionId(sessionId)
                .orElseGet(() -> {
                    ChatRoom room = ChatRoom.builder()
                            .sessionId(sessionId)
                            .visitorName(visitorName != null ? visitorName : "방문자")
                            .status(ChatRoom.RoomStatus.WAITING)
                            .build();
                    return roomRepo.save(room);
                });
    }

    /** 메시지 저장 + 채팅방 업데이트 */
    @Transactional
    public ChatMessage saveMessage(Long roomId, ChatMessage.SenderType senderType,
                                    String senderName, String content) {
        ChatMessage msg = ChatMessage.builder()
                .roomId(roomId)
                .senderType(senderType)
                .senderName(senderName)
                .content(content)
                .build();
        ChatMessage saved = msgRepo.save(msg);

        // 채팅방 메타 업데이트
        roomRepo.findById(roomId).ifPresent(room -> {
            room.setLastMessage(content.length() > 200 ? content.substring(0, 200) : content);
            room.setLastMessageAt(LocalDateTime.now());
            if (senderType == ChatMessage.SenderType.VISITOR) {
                room.setUnreadCount(room.getUnreadCount() + 1);
                if (room.getStatus() == ChatRoom.RoomStatus.CLOSED) {
                    room.setStatus(ChatRoom.RoomStatus.WAITING);
                }
            }
            roomRepo.save(room);
        });

        return saved;
    }

    /** 채팅방 목록 (관리자용) */
    public List<ChatRoomDto> getAllRooms() {
        return roomRepo.findAllByOrderByLastMessageAtDesc().stream()
                .map(ChatRoomDto::from)
                .toList();
    }

    /** 활성 채팅방 목록 */
    public List<ChatRoomDto> getActiveRooms() {
        return roomRepo.findByStatusInOrderByLastMessageAtDesc(
                List.of(ChatRoom.RoomStatus.WAITING, ChatRoom.RoomStatus.ACTIVE)
        ).stream().map(ChatRoomDto::from).toList();
    }

    /** 채팅방 메시지 목록 */
    public List<ChatMessageDto> getMessages(Long roomId) {
        return msgRepo.findByRoomIdOrderByCreatedAtAsc(roomId).stream()
                .map(ChatMessageDto::from)
                .toList();
    }

    /** 채팅방 상태 변경 */
    @Transactional
    public ChatRoomDto updateRoomStatus(Long roomId, ChatRoom.RoomStatus status, String assignee) {
        ChatRoom room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다: " + roomId));
        room.setStatus(status);
        if (assignee != null) room.setAssignee(assignee);
        return ChatRoomDto.from(roomRepo.save(room));
    }

    /** 읽음 처리 */
    @Transactional
    public void markAsRead(Long roomId) {
        roomRepo.findById(roomId).ifPresent(room -> {
            room.setUnreadCount(0);
            roomRepo.save(room);
        });
    }

    /** 대기 중 채팅방 수 */
    public long getWaitingCount() {
        return roomRepo.countByStatus(ChatRoom.RoomStatus.WAITING);
    }
}
