package kr.co.unionsystems.dataware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "seminars", schema = "dataware_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seminar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    private String department;

    private String preferredDate;

    private Integer attendees;

    @Column(columnDefinition = "TEXT")
    private String topic;

    @Column(columnDefinition = "TEXT")
    private String note;

    private Boolean consentPrivacy;

    private Boolean consentThirdParty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SeminarStatus status = SeminarStatus.NEW;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum SeminarStatus {
        NEW, CONFIRMED, COMPLETED, CANCELLED
    }
}
