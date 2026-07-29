package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContentResponse {
    private Long id;
    private Long menuId;
    private String regionKey;
    private String title;
    private String bodyHtml;
    private Long updatedBy;
    private LocalDateTime updatedAt;
}
