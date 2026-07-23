package kr.co.unionsystems.dataware.dto;

import kr.co.unionsystems.dataware.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String category;
    private String thumbnailUrl;
    private Boolean published;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .category(post.getCategory().name())
                .thumbnailUrl(post.getThumbnailUrl())
                .published(post.getPublished())
                .viewCount(post.getViewCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
