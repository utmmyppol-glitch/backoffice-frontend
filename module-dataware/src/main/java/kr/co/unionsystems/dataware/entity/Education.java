package kr.co.unionsystems.dataware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "educations", schema = "dataware_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Education {

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

    private String position;

    private String preferredDate;

    @Column(columnDefinition = "TEXT")
    private String note;

    private Boolean consentPrivacy;

    private Boolean consentThirdParty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EducationStatus status = EducationStatus.NEW;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum EducationStatus {
        NEW, CONFIRMED, COMPLETED, CANCELLED
    }
}
