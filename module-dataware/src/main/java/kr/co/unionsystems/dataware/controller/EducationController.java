package kr.co.unionsystems.dataware.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.dataware.dto.EducationRequest;
import kr.co.unionsystems.dataware.dto.EducationResponse;
import kr.co.unionsystems.dataware.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("datawareEducationController")
@RequestMapping("/api/dataware/educations")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitEducationRequest(
            @Valid @RequestBody EducationRequest request) {
        var saved = educationService.submitEducation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "무료교육 신청이 완료되었습니다", "id", saved.getId()));
    }

    @GetMapping
    public ResponseEntity<Page<EducationResponse>> getEducations(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(educationService.getEducations(pageable));
    }
}
