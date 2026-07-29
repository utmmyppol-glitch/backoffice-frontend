package kr.co.unionsystems.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAdminRequest {

    @NotBlank(message = "제품명은 필수입니다")
    private String name;

    @NotBlank(message = "슬러그는 필수입니다")
    private String slug;

    @NotBlank(message = "카테고리는 필수입니다")
    private String category;

    private String subtitle;

    private String description;

    private String features;

    private String iconUrl;

    private String thumbnailUrl;

    private String certification;

    private Integer sortOrder;

    private Boolean published;
}
