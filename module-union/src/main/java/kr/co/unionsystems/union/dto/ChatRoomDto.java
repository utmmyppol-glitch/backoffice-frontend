package kr.co.unionsystems.union.dto;

import kr.co.unionsystems.union.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {

    private Long id;
    private String sessionId;
    private String visitorName;
    private String visitorEmail;
    private ChatRoom.RoomStatus status;
    private String assignee;
    private int unreadCount;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;

    public static ChatRoomDto from(ChatRoom room) {
        return ChatRoomDto.builder()
                .id(room.getId())
                .sessionId(room.getSessionId())
                .visitorName(room.getVisitorName())
                .visitorEmail(room.getVisitorEmail())
                .status(room.getStatus())
                .assignee(room.getAssignee())
                .unreadCount(room.getUnreadCount())
                .lastMessage(room.getLastMessage())
                .lastMessageAt(room.getLastMessageAt())
                .createdAt(room.getCreatedAt())
                .build();
    }
}
