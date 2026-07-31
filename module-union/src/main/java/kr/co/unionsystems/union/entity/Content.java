package kr.co.unionsystems.union.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity(name = "UnionContent")
@Table(name = "content", schema = "union_schema",
       uniqueConstraints = @UniqueConstraint(columnNames = {"menu_id", "region_key"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id")
    private Long menuId;

    @Column(name = "region_key", nullable = false, length = 100)
    private String regionKey;

    @Column(length = 255)
    private String title;

    @Column(name = "body_html", columnDefinition = "TEXT")
    private String bodyHtml;

    @Column(name = "updated_by")
    private Long updatedBy;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
