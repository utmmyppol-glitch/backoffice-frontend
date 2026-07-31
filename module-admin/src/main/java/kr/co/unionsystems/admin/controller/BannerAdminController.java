package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.BannerAdminRequest;
import kr.co.unionsystems.admin.dto.BannerAdminResponse;
import kr.co.unionsystems.admin.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/{site}/banners")
@RequiredArgsConstructor
public class BannerAdminController {

    private final AdminBannerService adminBannerService;

    @GetMapping
    public ResponseEntity<List<BannerAdminResponse>> getBanners(@PathVariable String site) {
        return ResponseEntity.ok(adminBannerService.getBanners(site));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BannerAdminResponse> getBanner(
            @PathVariable String site, @PathVariable Long id) {
        return ResponseEntity.ok(adminBannerService.getBanner(site, id));
    }

    @PostMapping
    public ResponseEntity<BannerAdminResponse> createBanner(
            @PathVariable String site, @Valid @RequestBody BannerAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminBannerService.createBanner(site, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerAdminResponse> updateBanner(
            @PathVariable String site, @PathVariable Long id,
            @Valid @RequestBody BannerAdminRequest request) {
        return ResponseEntity.ok(adminBannerService.updateBanner(site, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(
            @PathVariable String site, @PathVariable Long id) {
        adminBannerService.deleteBanner(site, id);
        return ResponseEntity.noContent().build();
    }
}
