package kr.co.unionsystems.dataware.controller;

import kr.co.unionsystems.dataware.entity.Banner;
import kr.co.unionsystems.dataware.entity.Banner.BannerPosition;
import kr.co.unionsystems.dataware.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("datawareBannerController")
@RequestMapping("/api/dataware/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerRepository bannerRepository;

    @GetMapping
    public ResponseEntity<List<Banner>> getBanners(
            @RequestParam(required = false) String position) {
        if (position != null && !position.isEmpty()) {
            BannerPosition bannerPosition = BannerPosition.valueOf(position.toUpperCase());
            return ResponseEntity.ok(
                    bannerRepository.findByPositionAndIsActiveTrueOrderBySortOrderAsc(bannerPosition));
        }
        return ResponseEntity.ok(bannerRepository.findByIsActiveTrueOrderBySortOrderAsc());
    }

    @PostMapping
    public ResponseEntity<Banner> createBanner(@RequestBody Banner banner) {
        Banner saved = bannerRepository.save(banner);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
