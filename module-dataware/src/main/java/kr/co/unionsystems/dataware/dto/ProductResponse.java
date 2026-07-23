package kr.co.unionsystems.dataware.dto;

import kr.co.unionsystems.dataware.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String slug;
    private String category;
    private String subtitle;
    private String description;
    private String features;
    private String iconUrl;
    private String thumbnailUrl;
    private String certification;
    private Integer sortOrder;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .category(product.getCategory().name())
                .subtitle(product.getSubtitle())
                .description(product.getDescription())
                .features(product.getFeatures())
                .iconUrl(product.getIconUrl())
                .thumbnailUrl(product.getThumbnailUrl())
                .certification(product.getCertification())
                .sortOrder(product.getSortOrder())
                .published(product.getPublished())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
