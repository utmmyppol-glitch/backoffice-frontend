package kr.co.unionsystems.dataware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity(name = "DatawareClientLogo")
@Table(name = "client_logos", schema = "dataware_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientLogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String logoUrl;

    private Integer sortOrder;

    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
