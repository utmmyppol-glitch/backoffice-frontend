package kr.co.unionsystems.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerAdminRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    private String imageUrl;

    private String linkUrl;

    @NotBlank(message = "위치는 필수입니다")
    private String position;

    private Boolean isActive;

    private Integer sortOrder;
}
