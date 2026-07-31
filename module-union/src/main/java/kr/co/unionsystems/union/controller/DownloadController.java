package kr.co.unionsystems.union.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.union.dto.DownloadRequest;
import kr.co.unionsystems.union.service.DownloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("unionDownloadController")
@RequestMapping("/api/union/downloads")
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
}
