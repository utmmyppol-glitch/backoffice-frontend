package kr.co.unionsystems.admin.controller;

import kr.co.unionsystems.admin.dto.InquiryAdminResponse;
import kr.co.unionsystems.admin.dto.InquiryAnswerRequest;
import kr.co.unionsystems.admin.service.AdminInquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/{site}/inquiries")
@RequiredArgsConstructor
public class InquiryAdminController {

    private final AdminInquiryService adminInquiryService;

    @GetMapping
    public ResponseEntity<Page<InquiryAdminResponse>> getInquiries(
            @PathVariable String site,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminInquiryService.getInquiries(site, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InquiryAdminResponse> getInquiry(
            @PathVariable String site,
            @PathVariable Long id) {
        return ResponseEntity.ok(adminInquiryService.getInquiry(site, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InquiryAdminResponse> updateInquiry(
            @PathVariable String site,
            @PathVariable Long id,
            @RequestBody InquiryAnswerRequest request) {
        return ResponseEntity.ok(adminInquiryService.updateInquiry(site, id, request));
    }
}
