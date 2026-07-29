package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostAdminResponse {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String category;
    private String thumbnailUrl;
    private Boolean published;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
