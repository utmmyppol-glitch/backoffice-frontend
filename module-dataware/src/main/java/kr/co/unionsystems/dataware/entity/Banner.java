package kr.co.unionsystems.dataware.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity(name = "DatawareBanner")
@Table(name = "banners", schema = "dataware_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String imageUrl;

    private String linkUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BannerPosition position;

    @Builder.Default
    private Boolean isActive = true;

    private Integer sortOrder;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum BannerPosition {
        HERO, POPUP, PROMOTION
    }
}
