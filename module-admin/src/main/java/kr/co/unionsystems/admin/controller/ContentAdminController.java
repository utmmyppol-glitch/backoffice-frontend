package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.ContentHistoryResponse;
import kr.co.unionsystems.admin.dto.ContentRequest;
import kr.co.unionsystems.admin.dto.ContentResponse;
import kr.co.unionsystems.admin.service.AdminContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/{site}/contents")
@RequiredArgsConstructor
public class ContentAdminController {

    private final AdminContentService adminContentService;

    @GetMapping
    public ResponseEntity<List<ContentResponse>> getContents(
            @PathVariable String site,
            @RequestParam Long menuId) {
        return ResponseEntity.ok(adminContentService.getContentsByMenu(site, menuId));
    }

    @GetMapping("/detail")
    public ResponseEntity<ContentResponse> getContent(
            @PathVariable String site,
            @RequestParam Long menuId,
            @RequestParam String regionKey) {
        ContentResponse response = adminContentService.getContent(site, menuId, regionKey);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ContentResponse> saveContent(
            @PathVariable String site,
            @Valid @RequestBody ContentRequest request) {
        return ResponseEntity.ok(adminContentService.saveContent(site, request));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<ContentHistoryResponse>> getHistory(
            @PathVariable String site,
            @PathVariable Long id) {
        return ResponseEntity.ok(adminContentService.getHistory(site, id));
    }

    @PostMapping("/{id}/revert")
    public ResponseEntity<ContentResponse> revertContent(
            @PathVariable String site,
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long historyId = body.get("historyId");
        return ResponseEntity.ok(adminContentService.revertContent(site, id, historyId));
    }
}
