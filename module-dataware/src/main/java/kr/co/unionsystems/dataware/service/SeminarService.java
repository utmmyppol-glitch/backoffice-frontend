package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.dto.SeminarRequest;
import kr.co.unionsystems.dataware.dto.SeminarResponse;
import kr.co.unionsystems.dataware.entity.Seminar;
import kr.co.unionsystems.dataware.repository.SeminarRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("datawareSeminarService")
@RequiredArgsConstructor
@Slf4j
public class SeminarService {

    private final SeminarRepository seminarRepository;

    @Transactional
    public Seminar submitSeminar(SeminarRequest request) {
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
        log.info("세미나 신청: {} ({})", request.getName(), request.getCompany());
        return seminarRepository.save(seminar);
    }

    @Transactional(readOnly = true)
    public Page<SeminarResponse> getSeminars(Pageable pageable) {
        return seminarRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(SeminarResponse::from);
    }
}
