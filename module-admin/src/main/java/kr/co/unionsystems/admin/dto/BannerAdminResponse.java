package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BannerAdminResponse {
    private Long id;
    private String title;
    private String imageUrl;
    private String linkUrl;
    private String position;
    private Boolean isActive;
    private Integer sortOrder;
    private LocalDateTime createdAt;
}
