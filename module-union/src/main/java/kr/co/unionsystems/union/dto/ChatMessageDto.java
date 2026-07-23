package kr.co.unionsystems.union.dto;

import kr.co.unionsystems.union.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {

    private Long id;
    private Long roomId;
    private String sessionId;
    private ChatMessage.SenderType senderType;
    private String senderName;
    private String content;
    private LocalDateTime createdAt;

    public static ChatMessageDto from(ChatMessage msg) {
        return ChatMessageDto.builder()
                .id(msg.getId())
                .roomId(msg.getRoomId())
                .senderType(msg.getSenderType())
                .senderName(msg.getSenderName())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
