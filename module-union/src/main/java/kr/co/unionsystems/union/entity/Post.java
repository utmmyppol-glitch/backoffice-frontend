package kr.co.unionsystems.union.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity(name = "UnionPost")
@Table(name = "posts", schema = "union_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String excerpt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostCategory category;

    private String thumbnailUrl;

    @Builder.Default
    private Boolean published = false;

    @Builder.Default
    private Integer viewCount = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PostCategory {
        NOTICE, INSIGHT, EVENT
    }
}
