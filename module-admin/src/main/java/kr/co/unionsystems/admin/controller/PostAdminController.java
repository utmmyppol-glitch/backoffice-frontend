package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.PostAdminRequest;
import kr.co.unionsystems.admin.dto.PostAdminResponse;
import kr.co.unionsystems.admin.service.AdminPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/{site}/posts")
@RequiredArgsConstructor
public class PostAdminController {

    private final AdminPostService adminPostService;

    @GetMapping
    public ResponseEntity<Page<PostAdminResponse>> getPosts(
            @PathVariable String site,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminPostService.getPosts(site, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostAdminResponse> getPost(
            @PathVariable String site, @PathVariable Long id) {
        return ResponseEntity.ok(adminPostService.getPost(site, id));
    }

    @PostMapping
    public ResponseEntity<PostAdminResponse> createPost(
            @PathVariable String site, @Valid @RequestBody PostAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminPostService.createPost(site, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostAdminResponse> updatePost(
            @PathVariable String site, @PathVariable Long id,
            @Valid @RequestBody PostAdminRequest request) {
        return ResponseEntity.ok(adminPostService.updatePost(site, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String site, @PathVariable Long id) {
        adminPostService.deletePost(site, id);
        return ResponseEntity.noContent().build();
    }
}
