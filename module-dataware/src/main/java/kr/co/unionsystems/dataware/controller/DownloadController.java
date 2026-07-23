package kr.co.unionsystems.dataware.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.dataware.dto.DownloadRequest;
import kr.co.unionsystems.dataware.entity.Download;
import kr.co.unionsystems.dataware.repository.DownloadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import java.util.Map;

@RestController("datawareDownloadController")
@RequestMapping("/api/dataware/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadRepository downloadRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitDownloadRequest(
            @Valid @RequestBody DownloadRequest request) {
        Download download = Download.builder()
                .name(request.getName())
                .company(request.getCompany())
                .phone(request.getPhone())
                .email(request.getEmail())
                .fileType(request.getFileType())
                .consentPrivacy(request.getConsentPrivacy())
                .consentThirdParty(request.getConsentThirdParty())
                .consentMarketing(request.getConsentMarketing())
                .build();

        Download saved = downloadRepository.save(download);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "다운로드 신청이 완료되었습니다",
                        "id", saved.getId()
                ));
    }

    @GetMapping
    public ResponseEntity<Page<Download>> getDownloads(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(downloadRepository.findAllByOrderByCreatedAtDesc(pageable));
    }
}
