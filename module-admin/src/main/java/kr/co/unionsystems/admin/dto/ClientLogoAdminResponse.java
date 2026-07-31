package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClientLogoAdminResponse {
    private Long id;
    private String name;
    private String logoUrl;
    private Integer sortOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
