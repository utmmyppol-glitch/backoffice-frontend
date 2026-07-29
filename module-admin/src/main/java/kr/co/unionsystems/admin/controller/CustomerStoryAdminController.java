package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.CustomerStoryAdminRequest;
import kr.co.unionsystems.admin.dto.CustomerStoryAdminResponse;
import kr.co.unionsystems.admin.service.AdminCustomerStoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/{site}/customer-stories")
@RequiredArgsConstructor
public class CustomerStoryAdminController {

    private final AdminCustomerStoryService adminCustomerStoryService;

    @GetMapping
    public ResponseEntity<Page<CustomerStoryAdminResponse>> getStories(
            @PathVariable String site,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminCustomerStoryService.getStories(site, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerStoryAdminResponse> getStory(
            @PathVariable String site, @PathVariable Long id) {
        return ResponseEntity.ok(adminCustomerStoryService.getStory(site, id));
    }

    @PostMapping
    public ResponseEntity<CustomerStoryAdminResponse> createStory(
            @PathVariable String site, @Valid @RequestBody CustomerStoryAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminCustomerStoryService.createStory(site, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerStoryAdminResponse> updateStory(
            @PathVariable String site, @PathVariable Long id,
            @Valid @RequestBody CustomerStoryAdminRequest request) {
        return ResponseEntity.ok(adminCustomerStoryService.updateStory(site, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(
            @PathVariable String site, @PathVariable Long id) {
        adminCustomerStoryService.deleteStory(site, id);
        return ResponseEntity.noContent().build();
    }
}
