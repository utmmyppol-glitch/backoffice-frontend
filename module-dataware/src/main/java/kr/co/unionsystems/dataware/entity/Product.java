package kr.co.unionsystems.dataware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "products", schema = "dataware_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Column(columnDefinition = "TEXT")
    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String features;

    private String iconUrl;

    private String thumbnailUrl;

    private String certification;

    private Integer sortOrder;

    @Builder.Default
    private Boolean published = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ProductCategory {
        DATAWARE,
        DA_SHARP,
        META_SHARP,
        DQ_SHARP,
        AP_SHARP,
        DF_SHARP,
        ETT_SHARP,
        DP_SHARP
    }
}
