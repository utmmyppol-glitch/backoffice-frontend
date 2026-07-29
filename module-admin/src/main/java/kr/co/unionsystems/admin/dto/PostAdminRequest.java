package kr.co.unionsystems.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostAdminRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    private String content;

    private String excerpt;

    @NotBlank(message = "카테고리는 필수입니다")
    private String category;

    private String thumbnailUrl;

    private Boolean published;
}
