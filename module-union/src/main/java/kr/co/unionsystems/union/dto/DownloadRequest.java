package kr.co.unionsystems.union.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DownloadRequest {

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @NotBlank(message = "회사명은 필수입니다")
    private String company;

    @NotBlank(message = "연락처는 필수입니다")
    private String phone;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    private String fileType;

    @NotNull(message = "개인정보 수집 동의는 필수입니다")
    private Boolean consentPrivacy;

    private Boolean consentMarketing;
}
