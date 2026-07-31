package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductAdminResponse {
    private Long id;
    private String name;
    private String slug;
    private String category;
    private String subtitle;
    private String description;
    private String features;
    private String iconUrl;
    private String thumbnailUrl;
    private String certification;
    private Integer sortOrder;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
