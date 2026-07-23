package kr.co.unionsystems.union.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms", schema = "union_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 방문자 세션 식별자 (UUID) */
    @Column(nullable = false, unique = true)
    private String sessionId;

    /** 방문자 이름 (입력 시) */
    private String visitorName;

    /** 방문자 이메일 (입력 시) */
    private String visitorEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RoomStatus status = RoomStatus.WAITING;

    /** 담당 관리자 */
    private String assignee;

    /** 읽지 않은 메시지 수 (관리자 기준) */
    @Builder.Default
    private int unreadCount = 0;

    /** 마지막 메시지 미리보기 */
    @Column(length = 200)
    private String lastMessage;

    private LocalDateTime lastMessageAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum RoomStatus {
        WAITING,      // 대기 (관리자 응대 전)
        ACTIVE,       // 상담 중
        CLOSED        // 종료
    }
}
