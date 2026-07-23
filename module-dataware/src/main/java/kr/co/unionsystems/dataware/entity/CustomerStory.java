package kr.co.unionsystems.dataware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity(name = "DatawareCustomerStory")
@Table(name = "customer_stories", schema = "dataware_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    private String industry;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String thumbnailUrl;

    private String logoUrl;

    @Builder.Default
    private Boolean published = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
