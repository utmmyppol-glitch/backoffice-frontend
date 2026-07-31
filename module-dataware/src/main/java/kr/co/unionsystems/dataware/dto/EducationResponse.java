package kr.co.unionsystems.dataware.dto;

import kr.co.unionsystems.dataware.entity.Education;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationResponse {

    private Long id;
    private String name;
    private String company;
    private String email;
    private String position;
    private String preferredDate;
    private String note;
    private String status;
    private LocalDateTime createdAt;

    public static EducationResponse from(Education e) {
        return EducationResponse.builder()
                .id(e.getId())
                .name(e.getName())
                .company(e.getCompany())
                .email(e.getEmail())
                .position(e.getPosition())
                .preferredDate(e.getPreferredDate())
                .note(e.getNote())
                .status(e.getStatus().name())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
