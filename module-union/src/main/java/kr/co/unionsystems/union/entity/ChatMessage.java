package kr.co.unionsystems.union.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages", schema = "union_schema", indexes = {
    @Index(name = "idx_chat_msg_room", columnList = "roomId")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long roomId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SenderType senderType;

    /** 보낸 사람 이름 */
    private String senderName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum SenderType {
        VISITOR,   // 방문자
        ADMIN,     // 관리자
        SYSTEM     // 시스템 메시지 (입장/퇴장 등)
    }
}
