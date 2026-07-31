package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContentHistoryResponse {
    private Long id;
    private Long contentId;
    private String bodyHtml;
    private Long editedBy;
    private LocalDateTime editedAt;
}
