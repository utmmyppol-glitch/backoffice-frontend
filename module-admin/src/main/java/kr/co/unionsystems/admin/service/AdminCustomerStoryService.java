package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.CustomerStoryAdminRequest;
import kr.co.unionsystems.admin.dto.CustomerStoryAdminResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AdminCustomerStoryService {

    private final kr.co.unionsystems.union.repository.CustomerStoryRepository unionStoryRepo;
    private final kr.co.unionsystems.dataware.repository.CustomerStoryRepository datawareStoryRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminCustomerStoryService(
            @Qualifier("unionCustomerStoryRepository") kr.co.unionsystems.union.repository.CustomerStoryRepository unionStoryRepo,
            @Qualifier("datawareCustomerStoryRepository") kr.co.unionsystems.dataware.repository.CustomerStoryRepository datawareStoryRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionStoryRepo = unionStoryRepo;
        this.datawareStoryRepo = datawareStoryRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public Page<CustomerStoryAdminResponse> getStories(String site, Pageable pageable) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            return unionStoryRepo.findAllByOrderByCreatedAtDesc(pageable).map(this::fromUnion);
        }
        return datawareStoryRepo.findAllByOrderByCreatedAtDesc(pageable).map(this::fromDataware);
    }

    @Transactional(readOnly = true)
    public CustomerStoryAdminResponse getStory(String site, Long id) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            return unionStoryRepo.findById(id).map(this::fromUnion)
                    .orElseThrow(() -> new IllegalArgumentException("고객 사례를 찾을 수 없습니다: " + id));
        }
        return datawareStoryRepo.findById(id).map(this::fromDataware)
                .orElseThrow(() -> new IllegalArgumentException("고객 사례를 찾을 수 없습니다: " + id));
    }

    @Transactional
    public CustomerStoryAdminResponse createStory(String site, CustomerStoryAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var story = kr.co.unionsystems.union.entity.CustomerStory.builder()
                    .company(req.getCompany()).industry(req.getIndustry())
                    .title(req.getTitle()).content(req.getContent())
                    .thumbnailUrl(req.getThumbnailUrl()).logoUrl(req.getLogoUrl())
                    .published(req.getPublished() != null ? req.getPublished() : false).build();
            return fromUnion(unionStoryRepo.save(story));
        }
        var story = kr.co.unionsystems.dataware.entity.CustomerStory.builder()
                .company(req.getCompany()).industry(req.getIndustry())
                .title(req.getTitle()).content(req.getContent())
                .thumbnailUrl(req.getThumbnailUrl()).logoUrl(req.getLogoUrl())
                .published(req.getPublished() != null ? req.getPublished() : false).build();
        return fromDataware(datawareStoryRepo.save(story));
    }

    @Transactional
    public CustomerStoryAdminResponse updateStory(String site, Long id, CustomerStoryAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var story = unionStoryRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("고객 사례를 찾을 수 없습니다: " + id));
            story.setCompany(req.getCompany());
            story.setIndustry(req.getIndustry());
            story.setTitle(req.getTitle());
            story.setContent(req.getContent());
            story.setThumbnailUrl(req.getThumbnailUrl());
            story.setLogoUrl(req.getLogoUrl());
            if (req.getPublished() != null) story.setPublished(req.getPublished());
            return fromUnion(unionStoryRepo.save(story));
        }
        var story = datawareStoryRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("고객 사례를 찾을 수 없습니다: " + id));
        story.setCompany(req.getCompany());
        story.setIndustry(req.getIndustry());
        story.setTitle(req.getTitle());
        story.setContent(req.getContent());
        story.setThumbnailUrl(req.getThumbnailUrl());
        story.setLogoUrl(req.getLogoUrl());
        if (req.getPublished() != null) story.setPublished(req.getPublished());
        return fromDataware(datawareStoryRepo.save(story));
    }

    @Transactional
    public void deleteStory(String site, Long id) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) { unionStoryRepo.deleteById(id); }
        else { datawareStoryRepo.deleteById(id); }
    }

    private CustomerStoryAdminResponse fromUnion(kr.co.unionsystems.union.entity.CustomerStory cs) {
        return CustomerStoryAdminResponse.builder()
                .id(cs.getId()).company(cs.getCompany()).industry(cs.getIndustry())
                .title(cs.getTitle()).content(cs.getContent())
                .thumbnailUrl(cs.getThumbnailUrl()).logoUrl(cs.getLogoUrl())
                .published(cs.getPublished())
                .createdAt(cs.getCreatedAt()).updatedAt(cs.getUpdatedAt()).build();
    }

    private CustomerStoryAdminResponse fromDataware(kr.co.unionsystems.dataware.entity.CustomerStory cs) {
        return CustomerStoryAdminResponse.builder()
                .id(cs.getId()).company(cs.getCompany()).industry(cs.getIndustry())
                .title(cs.getTitle()).content(cs.getContent())
                .thumbnailUrl(cs.getThumbnailUrl()).logoUrl(cs.getLogoUrl())
                .published(cs.getPublished())
                .createdAt(cs.getCreatedAt()).updatedAt(cs.getUpdatedAt()).build();
    }
}
