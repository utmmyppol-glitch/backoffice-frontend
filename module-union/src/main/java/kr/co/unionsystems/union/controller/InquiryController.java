package kr.co.unionsystems.union.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.union.dto.InquiryRequest;
import kr.co.unionsystems.union.dto.InquiryResponse;
import kr.co.unionsystems.union.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("unionInquiryController")
@RequestMapping("/api/union/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(@Valid @RequestBody InquiryRequest request) {
        InquiryResponse response = inquiryService.createInquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<InquiryResponse>> getInquiries(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(inquiryService.getInquiries(pageable));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InquiryResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(inquiryService.updateStatus(id, status));
    }
}
