package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InquiryAdminResponse {
    private Long id;
    private String name;
    private String company;
    private String phone;
    private String email;
    private String message;
    private String product;
    private String status;
    private String assignee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
