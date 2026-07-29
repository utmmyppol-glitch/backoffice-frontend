package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.InquiryAdminResponse;
import kr.co.unionsystems.admin.dto.InquiryAnswerRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AdminInquiryService {

    private final kr.co.unionsystems.union.repository.InquiryRepository unionInquiryRepo;
    private final kr.co.unionsystems.dataware.repository.InquiryRepository datawareInquiryRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminInquiryService(
            @Qualifier("unionInquiryRepository") kr.co.unionsystems.union.repository.InquiryRepository unionInquiryRepo,
            @Qualifier("datawareInquiryRepository") kr.co.unionsystems.dataware.repository.InquiryRepository datawareInquiryRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionInquiryRepo = unionInquiryRepo;
        this.datawareInquiryRepo = datawareInquiryRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public Page<InquiryAdminResponse> getInquiries(String site, Pageable pageable) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return unionInquiryRepo.findAllByOrderByCreatedAtDesc(pageable)
                    .map(this::toUnionResponse);
        } else {
            return datawareInquiryRepo.findAllByOrderByCreatedAtDesc(pageable)
                    .map(this::toDatawareResponse);
        }
    }

    @Transactional(readOnly = true)
    public InquiryAdminResponse getInquiry(String site, Long id) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return unionInquiryRepo.findById(id)
                    .map(this::toUnionResponse)
                    .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다: " + id));
        } else {
            return datawareInquiryRepo.findById(id)
                    .map(this::toDatawareResponse)
                    .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다: " + id));
        }
    }

    @Transactional
    public InquiryAdminResponse updateInquiry(String site, Long id, InquiryAnswerRequest request) {
        siteAccessValidator.validateWriteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            var inquiry = unionInquiryRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다: " + id));
            if (request.getStatus() != null) {
                inquiry.setStatus(kr.co.unionsystems.union.entity.Inquiry.InquiryStatus.valueOf(request.getStatus()));
            }
            if (request.getAssignee() != null) {
                inquiry.setAssignee(request.getAssignee());
            }
            return toUnionResponse(unionInquiryRepo.save(inquiry));
        } else {
            var inquiry = datawareInquiryRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다: " + id));
            if (request.getStatus() != null) {
                inquiry.setStatus(kr.co.unionsystems.dataware.entity.Inquiry.InquiryStatus.valueOf(request.getStatus()));
            }
            if (request.getAssignee() != null) {
                inquiry.setAssignee(request.getAssignee());
            }
            return toDatawareResponse(datawareInquiryRepo.save(inquiry));
        }
    }

    private InquiryAdminResponse toUnionResponse(kr.co.unionsystems.union.entity.Inquiry i) {
        return InquiryAdminResponse.builder()
                .id(i.getId()).name(i.getName()).company(i.getCompany())
                .phone(i.getPhone()).email(i.getEmail()).message(i.getMessage())
                .product(i.getProduct()).status(i.getStatus().name())
                .assignee(i.getAssignee())
                .createdAt(i.getCreatedAt()).updatedAt(i.getUpdatedAt())
                .build();
    }

    private InquiryAdminResponse toDatawareResponse(kr.co.unionsystems.dataware.entity.Inquiry i) {
        return InquiryAdminResponse.builder()
                .id(i.getId()).name(i.getName()).company(i.getCompany())
                .phone(i.getPhone()).email(i.getEmail()).message(i.getMessage())
                .product(i.getProduct()).status(i.getStatus().name())
                .assignee(i.getAssignee())
                .createdAt(i.getCreatedAt()).updatedAt(i.getUpdatedAt())
                .build();
    }
}
