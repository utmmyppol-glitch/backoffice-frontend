package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DownloadAdminResponse {
    private Long id;
    private String name;
    private String company;
    private String phone;
    private String email;
    private String fileType;
    private LocalDateTime createdAt;
}
