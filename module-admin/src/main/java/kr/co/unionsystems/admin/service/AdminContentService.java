package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.config.AdminPrincipal;
import kr.co.unionsystems.admin.dto.ContentHistoryResponse;
import kr.co.unionsystems.admin.dto.ContentRequest;
import kr.co.unionsystems.admin.dto.ContentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminContentService {

    private final kr.co.unionsystems.union.repository.ContentRepository unionContentRepo;
    private final kr.co.unionsystems.union.repository.ContentHistoryRepository unionHistoryRepo;
    private final kr.co.unionsystems.dataware.repository.ContentRepository datawareContentRepo;
    private final kr.co.unionsystems.dataware.repository.ContentHistoryRepository datawareHistoryRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminContentService(
            @Qualifier("unionContentRepository") kr.co.unionsystems.union.repository.ContentRepository unionContentRepo,
            @Qualifier("unionContentHistoryRepository") kr.co.unionsystems.union.repository.ContentHistoryRepository unionHistoryRepo,
            @Qualifier("datawareContentRepository") kr.co.unionsystems.dataware.repository.ContentRepository datawareContentRepo,
            @Qualifier("datawareContentHistoryRepository") kr.co.unionsystems.dataware.repository.ContentHistoryRepository datawareHistoryRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionContentRepo = unionContentRepo;
        this.unionHistoryRepo = unionHistoryRepo;
        this.datawareContentRepo = datawareContentRepo;
        this.datawareHistoryRepo = datawareHistoryRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public ContentResponse getContent(String site, Long menuId, String regionKey) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return unionContentRepo.findByMenuIdAndRegionKey(menuId, regionKey)
                    .map(this::toUnionResponse)
                    .orElse(null);
        } else {
            return datawareContentRepo.findByMenuIdAndRegionKey(menuId, regionKey)
                    .map(this::toDatawareResponse)
                    .orElse(null);
        }
    }

    @Transactional(readOnly = true)
    public List<ContentResponse> getContentsByMenu(String site, Long menuId) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return unionContentRepo.findByMenuId(menuId).stream()
                    .map(this::toUnionResponse).collect(Collectors.toList());
        } else {
            return datawareContentRepo.findByMenuId(menuId).stream()
                    .map(this::toDatawareResponse).collect(Collectors.toList());
        }
    }

    @Transactional
    public ContentResponse saveContent(String site, ContentRequest request) {
        siteAccessValidator.validateWriteAccess(site);
        AdminPrincipal admin = siteAccessValidator.getCurrentAdmin();
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return saveUnionContent(request, admin.getId());
        } else {
            return saveDatawareContent(request, admin.getId());
        }
    }

    private ContentResponse saveUnionContent(ContentRequest request, Long adminId) {
        var existing = unionContentRepo.findByMenuIdAndRegionKey(request.getMenuId(), request.getRegionKey());

        if (existing.isPresent()) {
            var content = existing.get();
            // 이전 body_html을 이력에 저장
            if (content.getBodyHtml() != null) {
                unionHistoryRepo.save(kr.co.unionsystems.union.entity.ContentHistory.builder()
                        .contentId(content.getId())
                        .bodyHtml(content.getBodyHtml())
                        .editedBy(adminId)
                        .editedAt(LocalDateTime.now())
                        .build());
            }
            content.setTitle(request.getTitle());
            content.setBodyHtml(request.getBodyHtml());
            content.setUpdatedBy(adminId);
            return toUnionResponse(unionContentRepo.save(content));
        } else {
            var content = kr.co.unionsystems.union.entity.Content.builder()
                    .menuId(request.getMenuId())
                    .regionKey(request.getRegionKey())
                    .title(request.getTitle())
                    .bodyHtml(request.getBodyHtml())
                    .updatedBy(adminId)
                    .build();
            return toUnionResponse(unionContentRepo.save(content));
        }
    }

    private ContentResponse saveDatawareContent(ContentRequest request, Long adminId) {
        var existing = datawareContentRepo.findByMenuIdAndRegionKey(request.getMenuId(), request.getRegionKey());

        if (existing.isPresent()) {
            var content = existing.get();
            if (content.getBodyHtml() != null) {
                datawareHistoryRepo.save(kr.co.unionsystems.dataware.entity.ContentHistory.builder()
                        .contentId(content.getId())
                        .bodyHtml(content.getBodyHtml())
                        .editedBy(adminId)
                        .editedAt(LocalDateTime.now())
                        .build());
            }
            content.setTitle(request.getTitle());
            content.setBodyHtml(request.getBodyHtml());
            content.setUpdatedBy(adminId);
            return toDatawareResponse(datawareContentRepo.save(content));
        } else {
            var content = kr.co.unionsystems.dataware.entity.Content.builder()
                    .menuId(request.getMenuId())
                    .regionKey(request.getRegionKey())
                    .title(request.getTitle())
                    .bodyHtml(request.getBodyHtml())
                    .updatedBy(adminId)
                    .build();
            return toDatawareResponse(datawareContentRepo.save(content));
        }
    }

    @Transactional(readOnly = true)
    public List<ContentHistoryResponse> getHistory(String site, Long contentId) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return unionHistoryRepo.findByContentIdOrderByEditedAtDesc(contentId).stream()
                    .map(h -> ContentHistoryResponse.builder()
                            .id(h.getId()).contentId(h.getContentId())
                            .bodyHtml(h.getBodyHtml()).editedBy(h.getEditedBy())
                            .editedAt(h.getEditedAt()).build())
                    .collect(Collectors.toList());
        } else {
            return datawareHistoryRepo.findByContentIdOrderByEditedAtDesc(contentId).stream()
                    .map(h -> ContentHistoryResponse.builder()
                            .id(h.getId()).contentId(h.getContentId())
                            .bodyHtml(h.getBodyHtml()).editedBy(h.getEditedBy())
                            .editedAt(h.getEditedAt()).build())
                    .collect(Collectors.toList());
        }
    }

    @Transactional
    public ContentResponse revertContent(String site, Long contentId, Long historyId) {
        siteAccessValidator.validateWriteAccess(site);
        AdminPrincipal admin = siteAccessValidator.getCurrentAdmin();
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            var history = unionHistoryRepo.findById(historyId)
                    .orElseThrow(() -> new IllegalArgumentException("이력을 찾을 수 없습니다: " + historyId));
            var content = unionContentRepo.findById(contentId)
                    .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다: " + contentId));
            // 현재 내용을 이력에 저장
            unionHistoryRepo.save(kr.co.unionsystems.union.entity.ContentHistory.builder()
                    .contentId(content.getId())
                    .bodyHtml(content.getBodyHtml())
                    .editedBy(admin.getId())
                    .editedAt(LocalDateTime.now())
                    .build());
            content.setBodyHtml(history.getBodyHtml());
            content.setUpdatedBy(admin.getId());
            return toUnionResponse(unionContentRepo.save(content));
        } else {
            var history = datawareHistoryRepo.findById(historyId)
                    .orElseThrow(() -> new IllegalArgumentException("이력을 찾을 수 없습니다: " + historyId));
            var content = datawareContentRepo.findById(contentId)
                    .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다: " + contentId));
            datawareHistoryRepo.save(kr.co.unionsystems.dataware.entity.ContentHistory.builder()
                    .contentId(content.getId())
                    .bodyHtml(content.getBodyHtml())
                    .editedBy(admin.getId())
                    .editedAt(LocalDateTime.now())
                    .build());
            content.setBodyHtml(history.getBodyHtml());
            content.setUpdatedBy(admin.getId());
            return toDatawareResponse(datawareContentRepo.save(content));
        }
    }

    private ContentResponse toUnionResponse(kr.co.unionsystems.union.entity.Content c) {
        return ContentResponse.builder()
                .id(c.getId()).menuId(c.getMenuId()).regionKey(c.getRegionKey())
                .title(c.getTitle()).bodyHtml(c.getBodyHtml())
                .updatedBy(c.getUpdatedBy()).updatedAt(c.getUpdatedAt())
                .build();
    }

    private ContentResponse toDatawareResponse(kr.co.unionsystems.dataware.entity.Content c) {
        return ContentResponse.builder()
                .id(c.getId()).menuId(c.getMenuId()).regionKey(c.getRegionKey())
                .title(c.getTitle()).bodyHtml(c.getBodyHtml())
                .updatedBy(c.getUpdatedBy()).updatedAt(c.getUpdatedAt())
                .build();
    }
}
