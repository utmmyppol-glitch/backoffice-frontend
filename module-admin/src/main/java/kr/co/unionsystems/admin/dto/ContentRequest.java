package kr.co.unionsystems.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentRequest {

    @NotNull(message = "메뉴 ID는 필수입니다")
    private Long menuId;

    @NotBlank(message = "영역 키는 필수입니다")
    private String regionKey;

    private String title;

    private String bodyHtml;
}
