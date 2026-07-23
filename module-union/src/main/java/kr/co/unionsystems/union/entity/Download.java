package kr.co.unionsystems.union.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity(name = "UnionDownload")
@Table(name = "downloads", schema = "union_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Download {

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

    private String fileType;

    private Boolean consentPrivacy;

    private Boolean consentMarketing;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
