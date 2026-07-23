package kr.co.unionsystems.dataware.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.dataware.dto.EducationRequest;
import kr.co.unionsystems.dataware.entity.Education;
import kr.co.unionsystems.dataware.repository.EducationRepository;
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

    private final EducationRepository educationRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitEducationRequest(
            @Valid @RequestBody EducationRequest request) {
        Education education = Education.builder()
                .name(request.getName())
                .company(request.getCompany())
                .phone(request.getPhone())
                .email(request.getEmail())
                .position(request.getPosition())
                .preferredDate(request.getPreferredDate())
                .note(request.getNote())
                .consentPrivacy(request.getConsentPrivacy())
                .consentThirdParty(request.getConsentThirdParty())
                .build();

        Education saved = educationRepository.save(education);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "무료교육 신청이 완료되었습니다",
                        "id", saved.getId()
                ));
    }

    @GetMapping
    public ResponseEntity<Page<Education>> getEducations(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(educationRepository.findAllByOrderByCreatedAtDesc(pageable));
    }
}
