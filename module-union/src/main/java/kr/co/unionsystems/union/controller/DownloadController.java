package kr.co.unionsystems.union.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.union.dto.DownloadRequest;
import kr.co.unionsystems.union.entity.Download;
import kr.co.unionsystems.union.repository.DownloadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("unionDownloadController")
@RequestMapping("/api/union/downloads")
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
                .consentMarketing(request.getConsentMarketing())
                .build();

        Download saved = downloadRepository.save(download);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "다운로드 신청이 완료되었습니다",
                        "id", saved.getId()
                ));
    }
}
