package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.DownloadAdminResponse;
import kr.co.unionsystems.admin.dto.EducationAdminResponse;
import kr.co.unionsystems.admin.dto.SeminarAdminResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AdminCustomerDataService {

    private final kr.co.unionsystems.union.repository.DownloadRepository unionDownloadRepo;
    private final kr.co.unionsystems.dataware.repository.DownloadRepository datawareDownloadRepo;
    private final kr.co.unionsystems.dataware.repository.EducationRepository datawareEducationRepo;
    private final kr.co.unionsystems.dataware.repository.SeminarRepository datawareSeminarRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminCustomerDataService(
            @Qualifier("unionDownloadRepository") kr.co.unionsystems.union.repository.DownloadRepository unionDownloadRepo,
            @Qualifier("datawareDownloadRepository") kr.co.unionsystems.dataware.repository.DownloadRepository datawareDownloadRepo,
            kr.co.unionsystems.dataware.repository.EducationRepository datawareEducationRepo,
            kr.co.unionsystems.dataware.repository.SeminarRepository datawareSeminarRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionDownloadRepo = unionDownloadRepo;
        this.datawareDownloadRepo = datawareDownloadRepo;
        this.datawareEducationRepo = datawareEducationRepo;
        this.datawareSeminarRepo = datawareSeminarRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public Page<DownloadAdminResponse> getDownloads(String site, Pageable pageable) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return unionDownloadRepo.findAllByOrderByCreatedAtDesc(pageable)
                    .map(this::toUnionDownloadResponse);
        } else {
            return datawareDownloadRepo.findAllByOrderByCreatedAtDesc(pageable)
                    .map(this::toDatawareDownloadResponse);
        }
    }

    @Transactional(readOnly = true)
    public Page<EducationAdminResponse> getEducations(String site, Pageable pageable) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);
        if (!"dataware".equals(normalized)) {
            throw new IllegalArgumentException("교육 신청은 dataware 사이트에서만 조회할 수 있습니다");
        }
        return datawareEducationRepo.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toEducationResponse);
    }

    @Transactional(readOnly = true)
    public Page<SeminarAdminResponse> getSeminars(String site, Pageable pageable) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);
        if (!"dataware".equals(normalized)) {
            throw new IllegalArgumentException("세미나 신청은 dataware 사이트에서만 조회할 수 있습니다");
        }
        return datawareSeminarRepo.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toSeminarResponse);
    }

    private DownloadAdminResponse toUnionDownloadResponse(kr.co.unionsystems.union.entity.Download d) {
        return DownloadAdminResponse.builder()
                .id(d.getId()).name(d.getName()).company(d.getCompany())
                .phone(d.getPhone()).email(d.getEmail()).fileType(d.getFileType())
                .createdAt(d.getCreatedAt())
                .build();
    }

    private DownloadAdminResponse toDatawareDownloadResponse(kr.co.unionsystems.dataware.entity.Download d) {
        return DownloadAdminResponse.builder()
                .id(d.getId()).name(d.getName()).company(d.getCompany())
                .phone(d.getPhone()).email(d.getEmail()).fileType(d.getFileType())
                .createdAt(d.getCreatedAt())
                .build();
    }

    private EducationAdminResponse toEducationResponse(kr.co.unionsystems.dataware.entity.Education e) {
        return EducationAdminResponse.builder()
                .id(e.getId()).name(e.getName()).company(e.getCompany())
                .phone(e.getPhone()).email(e.getEmail()).position(e.getPosition())
                .preferredDate(e.getPreferredDate()).note(e.getNote())
                .status(e.getStatus().name()).createdAt(e.getCreatedAt())
                .build();
    }

    private SeminarAdminResponse toSeminarResponse(kr.co.unionsystems.dataware.entity.Seminar s) {
        return SeminarAdminResponse.builder()
                .id(s.getId()).name(s.getName()).company(s.getCompany())
                .phone(s.getPhone()).email(s.getEmail()).department(s.getDepartment())
                .preferredDate(s.getPreferredDate()).attendees(s.getAttendees())
                .topic(s.getTopic()).note(s.getNote())
                .status(s.getStatus().name()).createdAt(s.getCreatedAt())
                .build();
    }
}
