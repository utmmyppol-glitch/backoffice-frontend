package kr.co.unionsystems.dataware.dto;

import kr.co.unionsystems.dataware.entity.Seminar;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeminarResponse {

    private Long id;
    private String name;
    private String company;
    private String email;
    private String department;
    private String preferredDate;
    private Integer attendees;
    private String topic;
    private String status;
    private LocalDateTime createdAt;

    public static SeminarResponse from(Seminar s) {
        return SeminarResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .company(s.getCompany())
                .email(s.getEmail())
                .department(s.getDepartment())
                .preferredDate(s.getPreferredDate())
                .attendees(s.getAttendees())
                .topic(s.getTopic())
                .status(s.getStatus().name())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
