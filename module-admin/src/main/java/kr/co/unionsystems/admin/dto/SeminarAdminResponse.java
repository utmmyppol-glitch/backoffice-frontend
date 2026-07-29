package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SeminarAdminResponse {
    private Long id;
    private String name;
    private String company;
    private String phone;
    private String email;
    private String department;
    private String preferredDate;
    private Integer attendees;
    private String topic;
    private String note;
    private String status;
    private LocalDateTime createdAt;
}
