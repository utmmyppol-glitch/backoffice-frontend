package kr.co.unionsystems.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStoryAdminRequest {

    @NotBlank(message = "회사명은 필수입니다")
    private String company;

    private String industry;

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    private String content;

    private String thumbnailUrl;

    private String logoUrl;

    private Boolean published;
}
