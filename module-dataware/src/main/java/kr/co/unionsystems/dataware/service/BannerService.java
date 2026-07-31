package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.dto.BannerRequest;
import kr.co.unionsystems.dataware.entity.Banner;
import kr.co.unionsystems.dataware.entity.Banner.BannerPosition;
import kr.co.unionsystems.dataware.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("datawareBannerService")
@RequiredArgsConstructor
@Slf4j
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<Banner> getBanners(String position) {
        if (position != null && !position.isEmpty()) {
            BannerPosition bp = BannerPosition.valueOf(position.toUpperCase());
            return bannerRepository.findByPositionAndIsActiveTrueOrderBySortOrderAsc(bp);
        }
        return bannerRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }

    @Transactional
    public Banner createBanner(BannerRequest request) {
        Banner banner = Banner.builder()
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .linkUrl(request.getLinkUrl())
                .position(BannerPosition.valueOf(request.getPosition().toUpperCase()))
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .sortOrder(request.getSortOrder())
                .build();
        log.info("배너 생성: {}", request.getTitle());
        return bannerRepository.save(banner);
    }
}
