package kr.co.unionsystems.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuRequest {

    private Long parentId;

    @NotBlank(message = "메뉴 이름은 필수입니다")
    private String name;

    private String url;

    private String menuType;

    private Integer sortOrder;

    private Integer depth;

    private Boolean isExposed;
}
