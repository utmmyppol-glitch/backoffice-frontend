package kr.co.unionsystems.dataware.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.dataware.dto.SeminarRequest;
import kr.co.unionsystems.dataware.dto.SeminarResponse;
import kr.co.unionsystems.dataware.service.SeminarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("datawareSeminarController")
@RequestMapping("/api/dataware/seminars")
@RequiredArgsConstructor
public class SeminarController {

    private final SeminarService seminarService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitSeminarRequest(
            @Valid @RequestBody SeminarRequest request) {
        var saved = seminarService.submitSeminar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "방문 세미나 신청이 완료되었습니다", "id", saved.getId()));
    }

    @GetMapping
    public ResponseEntity<Page<SeminarResponse>> getSeminars(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(seminarService.getSeminars(pageable));
    }
}
