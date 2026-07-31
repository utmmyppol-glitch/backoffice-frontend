package kr.co.unionsystems.union.controller;

import kr.co.unionsystems.union.dto.CustomerStoryResponse;
import kr.co.unionsystems.union.entity.CustomerStory;
import kr.co.unionsystems.union.service.CustomerStoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("unionCustomerStoryController")
@RequestMapping("/api/union/customer-stories")
@RequiredArgsConstructor
public class CustomerStoryController {

    private final CustomerStoryService customerStoryService;

    @GetMapping
    public ResponseEntity<Page<CustomerStoryResponse>> getStories(
            @RequestParam(required = false) String industry,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(customerStoryService.getStories(industry, pageable));
    }

    @PostMapping
    public ResponseEntity<CustomerStoryResponse> createStory(@RequestBody CustomerStory story) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerStoryService.createStory(story));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerStoryResponse> updateStory(
            @PathVariable Long id,
            @RequestBody CustomerStory story) {
        return ResponseEntity.ok(customerStoryService.updateStory(id, story));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        customerStoryService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }
}
