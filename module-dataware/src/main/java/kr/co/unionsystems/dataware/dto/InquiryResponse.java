package kr.co.unionsystems.dataware.dto;

import kr.co.unionsystems.dataware.entity.Inquiry;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InquiryResponse {

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

    public static InquiryResponse from(Inquiry inquiry) {
        return InquiryResponse.builder()
                .id(inquiry.getId())
                .name(inquiry.getName())
                .company(inquiry.getCompany())
                .phone(inquiry.getPhone())
                .email(inquiry.getEmail())
                .message(inquiry.getMessage())
                .product(inquiry.getProduct())
                .status(inquiry.getStatus().name())
                .assignee(inquiry.getAssignee())
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .build();
    }
}
