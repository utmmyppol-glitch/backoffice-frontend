package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.dto.InquiryRequest;
import kr.co.unionsystems.dataware.dto.InquiryResponse;
import kr.co.unionsystems.dataware.entity.Inquiry;
import kr.co.unionsystems.dataware.entity.Inquiry.InquiryStatus;
import kr.co.unionsystems.dataware.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("datawareInquiryService")
@RequiredArgsConstructor
@Slf4j
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final EmailService emailService;

    @Transactional
    public InquiryResponse createInquiry(InquiryRequest request) {
        Inquiry inquiry = Inquiry.builder()
                .name(request.getName())
                .company(request.getCompany())
                .phone(request.getPhone())
                .email(request.getEmail())
                .message(request.getMessage())
                .product(request.getProduct())
                .consentPrivacy(request.getConsentPrivacy())
                .consentThirdParty(request.getConsentThirdParty())
                .status(InquiryStatus.NEW)
                .build();

        Inquiry saved = inquiryRepository.save(inquiry);
        log.info("New inquiry created: id={}, company={}", saved.getId(), saved.getCompany());

        emailService.sendInquiryNotification(saved);

        return InquiryResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Page<InquiryResponse> getInquiries(Pageable pageable) {
        return inquiryRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(InquiryResponse::from);
    }

    @Transactional
    public InquiryResponse updateStatus(Long id, String status) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다: " + id));

        inquiry.setStatus(InquiryStatus.valueOf(status));
        Inquiry updated = inquiryRepository.save(inquiry);
        log.info("Inquiry status updated: id={}, status={}", id, status);

        return InquiryResponse.from(updated);
    }
}
