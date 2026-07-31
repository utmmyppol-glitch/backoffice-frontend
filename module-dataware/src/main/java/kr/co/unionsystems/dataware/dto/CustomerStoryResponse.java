package kr.co.unionsystems.dataware.dto;

import kr.co.unionsystems.dataware.entity.CustomerStory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStoryResponse {

    private Long id;
    private String company;
    private String industry;
    private String title;
    private String content;
    private String thumbnailUrl;
    private String logoUrl;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CustomerStoryResponse from(CustomerStory story) {
        return CustomerStoryResponse.builder()
                .id(story.getId())
                .company(story.getCompany())
                .industry(story.getIndustry())
                .title(story.getTitle())
                .content(story.getContent())
                .thumbnailUrl(story.getThumbnailUrl())
                .logoUrl(story.getLogoUrl())
                .published(story.getPublished())
                .createdAt(story.getCreatedAt())
                .updatedAt(story.getUpdatedAt())
                .build();
    }
}
