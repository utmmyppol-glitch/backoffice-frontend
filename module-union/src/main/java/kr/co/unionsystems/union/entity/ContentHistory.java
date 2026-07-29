package kr.co.unionsystems.union.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "UnionContentHistory")
@Table(name = "content_history", schema = "union_schema")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_id")
    private Long contentId;

    @Column(name = "body_html", columnDefinition = "TEXT")
    private String bodyHtml;

    @Column(name = "edited_by")
    private Long editedBy;

    @Column(name = "edited_at")
    @Builder.Default
    private LocalDateTime editedAt = LocalDateTime.now();
}
