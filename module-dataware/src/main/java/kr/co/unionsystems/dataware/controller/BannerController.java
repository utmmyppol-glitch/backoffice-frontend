package kr.co.unionsystems.dataware.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.dataware.dto.BannerRequest;
import kr.co.unionsystems.dataware.entity.Banner;
import kr.co.unionsystems.dataware.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("datawareBannerController")
@RequestMapping("/api/dataware/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<Banner>> getBanners(
            @RequestParam(required = false) String position) {
        return ResponseEntity.ok(bannerService.getBanners(position));
    }

    @PostMapping
    public ResponseEntity<Banner> createBanner(@Valid @RequestBody BannerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerService.createBanner(request));
    }
}
