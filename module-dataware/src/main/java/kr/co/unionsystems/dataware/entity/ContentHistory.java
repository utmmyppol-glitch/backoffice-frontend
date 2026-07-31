package kr.co.unionsystems.dataware.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "DatawareContentHistory")
@Table(name = "content_history", schema = "dataware_schema")
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
