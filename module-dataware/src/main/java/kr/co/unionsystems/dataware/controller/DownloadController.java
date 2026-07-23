package kr.co.unionsystems.dataware.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.dataware.dto.DownloadRequest;
import kr.co.unionsystems.dataware.dto.DownloadResponse;
import kr.co.unionsystems.dataware.service.DownloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("datawareDownloadController")
@RequestMapping("/api/dataware/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitDownloadRequest(
            @Valid @RequestBody DownloadRequest request) {
        var saved = downloadService.submitDownload(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "다운로드 신청이 완료되었습니다", "id", saved.getId()));
    }

    @GetMapping
    public ResponseEntity<Page<DownloadResponse>> getDownloads(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(downloadService.getDownloads(pageable));
    }
}
