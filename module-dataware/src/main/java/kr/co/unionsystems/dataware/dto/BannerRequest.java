package kr.co.unionsystems.dataware.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {

    @NotBlank
    private String title;

    private String imageUrl;

    private String linkUrl;

    @NotNull
    private String position;

    private Boolean isActive = true;

    private Integer sortOrder;
}
