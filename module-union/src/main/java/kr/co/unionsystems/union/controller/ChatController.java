package kr.co.unionsystems.union.controller;

import kr.co.unionsystems.union.dto.ChatMessageDto;
import kr.co.unionsystems.union.dto.ChatRoomDto;
import kr.co.unionsystems.union.entity.ChatMessage;
import kr.co.unionsystems.union.entity.ChatRoom;
import kr.co.unionsystems.union.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController("unionChatController")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    /* ═══════════════════════════════════════════
     * WebSocket STOMP 메시지 핸들러
     * ═══════════════════════════════════════════ */

    /** 방문자: 채팅방 입장 (없으면 생성) */
    @MessageMapping("/chat.join")
    public void joinRoom(@Payload ChatMessageDto dto) {
        ChatRoom room = chatService.getOrCreateRoom(dto.getSessionId(), dto.getSenderName());

        // 시스템 메시지 저장
        ChatMessage sysMsg = chatService.saveMessage(
                room.getId(), ChatMessage.SenderType.SYSTEM,
                "시스템", dto.getSenderName() + "님이 상담을 시작했습니다.");

        ChatMessageDto sysMsgDto = ChatMessageDto.from(sysMsg);
        sysMsgDto.setRoomId(room.getId());
        sysMsgDto.setSessionId(dto.getSessionId());

        // 해당 채팅방 구독자에게 전송
        messagingTemplate.convertAndSend("/topic/chat/" + room.getId(), sysMsgDto);
        // 관리자 대시보드에 새 채팅방 알림
        messagingTemplate.convertAndSend("/topic/admin/rooms", ChatRoomDto.from(room));

        // 방문자에게 roomId 전달
        messagingTemplate.convertAndSend("/topic/chat/joined/" + dto.getSessionId(),
                Map.of("roomId", room.getId(), "sessionId", dto.getSessionId()));
    }

    /** 방문자/관리자: 메시지 전송 */
    @MessageMapping("/chat.send/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId, @Payload ChatMessageDto dto) {
        ChatMessage saved = chatService.saveMessage(
                roomId, dto.getSenderType(), dto.getSenderName(), dto.getContent());

        ChatMessageDto response = ChatMessageDto.from(saved);
        response.setRoomId(roomId);
        response.setSessionId(dto.getSessionId());

        // 채팅방 구독자에게 브로드캐스트
        messagingTemplate.convertAndSend("/topic/chat/" + roomId, response);
        // 관리자 대시보드 목록 갱신
        messagingTemplate.convertAndSend("/topic/admin/rooms-update",
                Map.of("roomId", roomId, "lastMessage", dto.getContent(),
                        "senderType", dto.getSenderType().name()));
    }

    /* ═══════════════════════════════════════════
     * REST API (관리자용)
     * ═══════════════════════════════════════════ */

    /** 채팅방 목록 */
    @GetMapping("/api/union/chat/rooms")
    public ResponseEntity<List<ChatRoomDto>> getRooms(
            @RequestParam(required = false, defaultValue = "all") String filter) {
        if ("active".equals(filter)) {
            return ResponseEntity.ok(chatService.getActiveRooms());
        }
        return ResponseEntity.ok(chatService.getAllRooms());
    }

    /** 채팅방 메시지 목록 */
    @GetMapping("/api/union/chat/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getMessages(roomId));
    }

    /** 채팅방 상태 변경 */
    @PatchMapping("/api/union/chat/rooms/{roomId}/status")
    public ResponseEntity<ChatRoomDto> updateStatus(
            @PathVariable Long roomId,
            @RequestBody Map<String, String> body) {
        ChatRoom.RoomStatus status = ChatRoom.RoomStatus.valueOf(body.get("status"));
        String assignee = body.get("assignee");
        return ResponseEntity.ok(chatService.updateRoomStatus(roomId, status, assignee));
    }

    /** 읽음 처리 */
    @PostMapping("/api/union/chat/rooms/{roomId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long roomId) {
        chatService.markAsRead(roomId);
        return ResponseEntity.ok().build();
    }

    /** 대기 중 채팅 수 */
    @GetMapping("/api/union/chat/waiting-count")
    public ResponseEntity<Map<String, Long>> getWaitingCount() {
        return ResponseEntity.ok(Map.of("count", chatService.getWaitingCount()));
    }
}
