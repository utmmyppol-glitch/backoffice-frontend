package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.BannerAdminRequest;
import kr.co.unionsystems.admin.dto.BannerAdminResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminBannerService {

    private final kr.co.unionsystems.union.repository.BannerRepository unionBannerRepo;
    private final kr.co.unionsystems.dataware.repository.BannerRepository datawareBannerRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminBannerService(
            @Qualifier("unionBannerRepository") kr.co.unionsystems.union.repository.BannerRepository unionBannerRepo,
            @Qualifier("datawareBannerRepository") kr.co.unionsystems.dataware.repository.BannerRepository datawareBannerRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionBannerRepo = unionBannerRepo;
        this.datawareBannerRepo = datawareBannerRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public List<BannerAdminResponse> getBanners(String site) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            return unionBannerRepo.findAll(Sort.by("sortOrder")).stream().map(this::fromUnion).collect(Collectors.toList());
        }
        return datawareBannerRepo.findAll(Sort.by("sortOrder")).stream().map(this::fromDataware).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BannerAdminResponse getBanner(String site, Long id) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            return unionBannerRepo.findById(id).map(this::fromUnion)
                    .orElseThrow(() -> new IllegalArgumentException("배너를 찾을 수 없습니다: " + id));
        }
        return datawareBannerRepo.findById(id).map(this::fromDataware)
                .orElseThrow(() -> new IllegalArgumentException("배너를 찾을 수 없습니다: " + id));
    }

    @Transactional
    public BannerAdminResponse createBanner(String site, BannerAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var banner = kr.co.unionsystems.union.entity.Banner.builder()
                    .title(req.getTitle()).imageUrl(req.getImageUrl()).linkUrl(req.getLinkUrl())
                    .position(kr.co.unionsystems.union.entity.Banner.BannerPosition.valueOf(req.getPosition()))
                    .isActive(req.getIsActive() != null ? req.getIsActive() : true)
                    .sortOrder(req.getSortOrder()).build();
            return fromUnion(unionBannerRepo.save(banner));
        }
        var banner = kr.co.unionsystems.dataware.entity.Banner.builder()
                .title(req.getTitle()).imageUrl(req.getImageUrl()).linkUrl(req.getLinkUrl())
                .position(kr.co.unionsystems.dataware.entity.Banner.BannerPosition.valueOf(req.getPosition()))
                .isActive(req.getIsActive() != null ? req.getIsActive() : true)
                .sortOrder(req.getSortOrder()).build();
        return fromDataware(datawareBannerRepo.save(banner));
    }

    @Transactional
    public BannerAdminResponse updateBanner(String site, Long id, BannerAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var banner = unionBannerRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("배너를 찾을 수 없습니다: " + id));
            banner.setTitle(req.getTitle());
            banner.setImageUrl(req.getImageUrl());
            banner.setLinkUrl(req.getLinkUrl());
            if (req.getPosition() != null) banner.setPosition(kr.co.unionsystems.union.entity.Banner.BannerPosition.valueOf(req.getPosition()));
            if (req.getIsActive() != null) banner.setIsActive(req.getIsActive());
            if (req.getSortOrder() != null) banner.setSortOrder(req.getSortOrder());
            return fromUnion(unionBannerRepo.save(banner));
        }
        var banner = datawareBannerRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("배너를 찾을 수 없습니다: " + id));
        banner.setTitle(req.getTitle());
        banner.setImageUrl(req.getImageUrl());
        banner.setLinkUrl(req.getLinkUrl());
        if (req.getPosition() != null) banner.setPosition(kr.co.unionsystems.dataware.entity.Banner.BannerPosition.valueOf(req.getPosition()));
        if (req.getIsActive() != null) banner.setIsActive(req.getIsActive());
        if (req.getSortOrder() != null) banner.setSortOrder(req.getSortOrder());
        return fromDataware(datawareBannerRepo.save(banner));
    }

    @Transactional
    public void deleteBanner(String site, Long id) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) { unionBannerRepo.deleteById(id); }
        else { datawareBannerRepo.deleteById(id); }
    }

    private BannerAdminResponse fromUnion(kr.co.unionsystems.union.entity.Banner b) {
        return BannerAdminResponse.builder()
                .id(b.getId()).title(b.getTitle()).imageUrl(b.getImageUrl()).linkUrl(b.getLinkUrl())
                .position(b.getPosition().name()).isActive(b.getIsActive()).sortOrder(b.getSortOrder())
                .createdAt(b.getCreatedAt()).build();
    }

    private BannerAdminResponse fromDataware(kr.co.unionsystems.dataware.entity.Banner b) {
        return BannerAdminResponse.builder()
                .id(b.getId()).title(b.getTitle()).imageUrl(b.getImageUrl()).linkUrl(b.getLinkUrl())
                .position(b.getPosition().name()).isActive(b.getIsActive()).sortOrder(b.getSortOrder())
                .createdAt(b.getCreatedAt()).build();
    }
}
