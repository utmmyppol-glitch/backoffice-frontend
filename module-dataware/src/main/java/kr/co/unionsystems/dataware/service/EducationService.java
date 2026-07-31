package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.dto.EducationRequest;
import kr.co.unionsystems.dataware.dto.EducationResponse;
import kr.co.unionsystems.dataware.entity.Education;
import kr.co.unionsystems.dataware.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("datawareEducationService")
@RequiredArgsConstructor
@Slf4j
public class EducationService {

    private final EducationRepository educationRepository;

    @Transactional
    public Education submitEducation(EducationRequest request) {
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
        log.info("교육 신청: {} ({})", request.getName(), request.getCompany());
        return educationRepository.save(education);
    }

    @Transactional(readOnly = true)
    public Page<EducationResponse> getEducations(Pageable pageable) {
        return educationRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(EducationResponse::from);
    }
}
