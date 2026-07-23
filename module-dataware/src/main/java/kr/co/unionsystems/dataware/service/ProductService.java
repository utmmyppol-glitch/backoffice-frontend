package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.dto.ProductResponse;
import kr.co.unionsystems.dataware.entity.Product;
import kr.co.unionsystems.dataware.entity.Product.ProductCategory;
import kr.co.unionsystems.dataware.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("datawareProductService")
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(String category) {
        if (category != null && !category.isEmpty()) {
            ProductCategory productCategory = ProductCategory.valueOf(category.toUpperCase());
            return productRepository.findByCategoryAndPublishedTrueOrderBySortOrderAsc(productCategory)
                    .stream().map(ProductResponse::from).toList();
        }
        return productRepository.findByPublishedTrueOrderBySortOrderAsc()
                .stream().map(ProductResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다: " + slug));
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse createProduct(Product product) {
        Product saved = productRepository.save(product);
        log.info("Product created: id={}, name={}", saved.getId(), saved.getName());
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, Product productData) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다: " + id));

        product.setName(productData.getName());
        product.setSlug(productData.getSlug());
        product.setCategory(productData.getCategory());
        product.setSubtitle(productData.getSubtitle());
        product.setDescription(productData.getDescription());
        product.setFeatures(productData.getFeatures());
        product.setIconUrl(productData.getIconUrl());
        product.setThumbnailUrl(productData.getThumbnailUrl());
        product.setCertification(productData.getCertification());
        product.setSortOrder(productData.getSortOrder());
        product.setPublished(productData.getPublished());

        Product updated = productRepository.save(product);
        log.info("Product updated: id={}", id);
        return ProductResponse.from(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("제품을 찾을 수 없습니다: " + id);
        }
        productRepository.deleteById(id);
        log.info("Product deleted: id={}", id);
    }
}
