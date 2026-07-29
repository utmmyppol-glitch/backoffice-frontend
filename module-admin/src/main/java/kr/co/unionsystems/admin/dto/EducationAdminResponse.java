package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EducationAdminResponse {
    private Long id;
    private String name;
    private String company;
    private String phone;
    private String email;
    private String position;
    private String preferredDate;
    private String note;
    private String status;
    private LocalDateTime createdAt;
}
