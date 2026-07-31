package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MenuResponse {
    private Long id;
    private Long parentId;
    private String name;
    private String url;
    private String menuType;
    private Integer sortOrder;
    private Integer depth;
    private Boolean isExposed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MenuResponse> children;
}
