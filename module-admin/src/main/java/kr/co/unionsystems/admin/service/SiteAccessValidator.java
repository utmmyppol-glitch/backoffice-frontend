package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.config.AdminPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SiteAccessValidator {

    public AdminPrincipal getCurrentAdmin() {
        return (AdminPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }

    public void validateSiteAccess(String site) {
        AdminPrincipal admin = getCurrentAdmin();
        if ("SUPER".equals(admin.getRole())) {
            return;
        }
        String expectedSite = site.toUpperCase();
        if (admin.getSite() == null || !admin.getSite().equals(expectedSite)) {
            throw new AccessDeniedException("해당 사이트에 대한 접근 권한이 없습니다");
        }
    }

    public void validateWriteAccess(String site) {
        validateSiteAccess(site);
        AdminPrincipal admin = getCurrentAdmin();
        if ("VIEWER".equals(admin.getRole())) {
            throw new AccessDeniedException("조회 전용 계정은 수정할 수 없습니다");
        }
    }

    public String normalizeSite(String site) {
        String normalized = site.toLowerCase();
        if (!"union".equals(normalized) && !"dataware".equals(normalized)) {
            throw new IllegalArgumentException("유효하지 않은 사이트: " + site);
        }
        return normalized;
    }
}
