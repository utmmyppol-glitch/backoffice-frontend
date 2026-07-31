package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CustomerStoryAdminResponse {
    private Long id;
    private String company;
    private String industry;
    private String title;
    private String content;
    private String thumbnailUrl;
    private String logoUrl;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
