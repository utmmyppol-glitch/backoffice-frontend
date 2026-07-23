package kr.co.unionsystems.dataware.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.dataware.dto.SeminarRequest;
import kr.co.unionsystems.dataware.entity.Seminar;
import kr.co.unionsystems.dataware.repository.SeminarRepository;
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

    private final SeminarRepository seminarRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitSeminarRequest(
            @Valid @RequestBody SeminarRequest request) {
        Seminar seminar = Seminar.builder()
                .name(request.getName())
                .company(request.getCompany())
                .phone(request.getPhone())
                .email(request.getEmail())
                .department(request.getDepartment())
                .preferredDate(request.getPreferredDate())
                .attendees(request.getAttendees())
                .topic(request.getTopic())
                .note(request.getNote())
                .consentPrivacy(request.getConsentPrivacy())
                .consentThirdParty(request.getConsentThirdParty())
                .build();

        Seminar saved = seminarRepository.save(seminar);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "방문 세미나 신청이 완료되었습니다",
                        "id", saved.getId()
                ));
    }

    @GetMapping
    public ResponseEntity<Page<Seminar>> getSeminars(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(seminarRepository.findAllByOrderByCreatedAtDesc(pageable));
    }
}
