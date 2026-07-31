package kr.co.unionsystems.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientLogoAdminRequest {

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    private String logoUrl;

    private Integer sortOrder;

    private Boolean isActive;
}
