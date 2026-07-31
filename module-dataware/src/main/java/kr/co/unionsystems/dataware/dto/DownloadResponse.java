package kr.co.unionsystems.dataware.dto;

import kr.co.unionsystems.dataware.entity.Download;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DownloadResponse {

    private Long id;
    private String name;
    private String company;
    private String email;
    private String fileType;
    private LocalDateTime createdAt;

    public static DownloadResponse from(Download d) {
        return DownloadResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .company(d.getCompany())
                .email(d.getEmail())
                .fileType(d.getFileType())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
