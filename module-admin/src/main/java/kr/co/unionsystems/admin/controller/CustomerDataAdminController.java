package kr.co.unionsystems.admin.controller;

import kr.co.unionsystems.admin.dto.DownloadAdminResponse;
import kr.co.unionsystems.admin.dto.EducationAdminResponse;
import kr.co.unionsystems.admin.dto.SeminarAdminResponse;
import kr.co.unionsystems.admin.service.AdminCustomerDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/{site}")
@RequiredArgsConstructor
public class CustomerDataAdminController {

    private final AdminCustomerDataService adminCustomerDataService;

    @GetMapping("/downloads")
    public ResponseEntity<Page<DownloadAdminResponse>> getDownloads(
            @PathVariable String site,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminCustomerDataService.getDownloads(site, pageable));
    }

    @GetMapping("/educations")
    public ResponseEntity<Page<EducationAdminResponse>> getEducations(
            @PathVariable String site,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminCustomerDataService.getEducations(site, pageable));
    }

    @GetMapping("/seminars")
    public ResponseEntity<Page<SeminarAdminResponse>> getSeminars(
            @PathVariable String site,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminCustomerDataService.getSeminars(site, pageable));
    }
}
