package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.ProductAdminRequest;
import kr.co.unionsystems.admin.dto.ProductAdminResponse;
import kr.co.unionsystems.dataware.entity.Product;
import kr.co.unionsystems.dataware.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminProductService {

    private final ProductRepository productRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminProductService(ProductRepository productRepo, SiteAccessValidator siteAccessValidator) {
        this.productRepo = productRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public List<ProductAdminResponse> getProducts(String site) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if (!"dataware".equals(s)) {
            throw new IllegalArgumentException("제품 관리는 dataware 사이트에서만 가능합니다");
        }
        return productRepo.findAll(Sort.by("sortOrder")).stream().map(this::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductAdminResponse getProduct(String site, Long id) {
        siteAccessValidator.validateSiteAccess(site);
        siteAccessValidator.normalizeSite(site);
        return productRepo.findById(id).map(this::from)
                .orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다: " + id));
    }

    @Transactional
    public ProductAdminResponse createProduct(String site, ProductAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if (!"dataware".equals(s)) {
            throw new IllegalArgumentException("제품 관리는 dataware 사이트에서만 가능합니다");
        }
        var product = Product.builder()
                .name(req.getName()).slug(req.getSlug())
                .category(Product.ProductCategory.valueOf(req.getCategory()))
                .subtitle(req.getSubtitle()).description(req.getDescription())
                .features(req.getFeatures()).iconUrl(req.getIconUrl())
                .thumbnailUrl(req.getThumbnailUrl()).certification(req.getCertification())
                .sortOrder(req.getSortOrder())
                .published(req.getPublished() != null ? req.getPublished() : true).build();
        return from(productRepo.save(product));
    }

    @Transactional
    public ProductAdminResponse updateProduct(String site, Long id, ProductAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        var product = productRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다: " + id));
        product.setName(req.getName());
        product.setSlug(req.getSlug());
        if (req.getCategory() != null) product.setCategory(Product.ProductCategory.valueOf(req.getCategory()));
        product.setSubtitle(req.getSubtitle());
        product.setDescription(req.getDescription());
        product.setFeatures(req.getFeatures());
        product.setIconUrl(req.getIconUrl());
        product.setThumbnailUrl(req.getThumbnailUrl());
        product.setCertification(req.getCertification());
        if (req.getSortOrder() != null) product.setSortOrder(req.getSortOrder());
        if (req.getPublished() != null) product.setPublished(req.getPublished());
        return from(productRepo.save(product));
    }

    @Transactional
    public void deleteProduct(String site, Long id) {
        siteAccessValidator.validateWriteAccess(site);
        productRepo.deleteById(id);
    }

    private ProductAdminResponse from(Product p) {
        return ProductAdminResponse.builder()
                .id(p.getId()).name(p.getName()).slug(p.getSlug())
                .category(p.getCategory().name()).subtitle(p.getSubtitle())
                .description(p.getDescription()).features(p.getFeatures())
                .iconUrl(p.getIconUrl()).thumbnailUrl(p.getThumbnailUrl())
                .certification(p.getCertification()).sortOrder(p.getSortOrder())
                .published(p.getPublished())
                .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }
}
