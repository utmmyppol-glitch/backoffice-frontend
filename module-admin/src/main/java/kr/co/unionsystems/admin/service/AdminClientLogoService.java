package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.ClientLogoAdminRequest;
import kr.co.unionsystems.admin.dto.ClientLogoAdminResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminClientLogoService {

    private final kr.co.unionsystems.union.repository.ClientLogoRepository unionLogoRepo;
    private final kr.co.unionsystems.dataware.repository.ClientLogoRepository datawareLogoRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminClientLogoService(
            @Qualifier("unionClientLogoRepository") kr.co.unionsystems.union.repository.ClientLogoRepository unionLogoRepo,
            @Qualifier("datawareClientLogoRepository") kr.co.unionsystems.dataware.repository.ClientLogoRepository datawareLogoRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionLogoRepo = unionLogoRepo;
        this.datawareLogoRepo = datawareLogoRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public List<ClientLogoAdminResponse> getLogos(String site) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            return unionLogoRepo.findAll(Sort.by("sortOrder")).stream().map(this::fromUnion).collect(Collectors.toList());
        }
        return datawareLogoRepo.findAll(Sort.by("sortOrder")).stream().map(this::fromDataware).collect(Collectors.toList());
    }

    @Transactional
    public ClientLogoAdminResponse createLogo(String site, ClientLogoAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var logo = kr.co.unionsystems.union.entity.ClientLogo.builder()
                    .name(req.getName()).logoUrl(req.getLogoUrl())
                    .sortOrder(req.getSortOrder())
                    .isActive(req.getIsActive() != null ? req.getIsActive() : true).build();
            return fromUnion(unionLogoRepo.save(logo));
        }
        var logo = kr.co.unionsystems.dataware.entity.ClientLogo.builder()
                .name(req.getName()).logoUrl(req.getLogoUrl())
                .sortOrder(req.getSortOrder())
                .isActive(req.getIsActive() != null ? req.getIsActive() : true).build();
        return fromDataware(datawareLogoRepo.save(logo));
    }

    @Transactional
    public ClientLogoAdminResponse updateLogo(String site, Long id, ClientLogoAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var logo = unionLogoRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("로고를 찾을 수 없습니다: " + id));
            logo.setName(req.getName());
            logo.setLogoUrl(req.getLogoUrl());
            if (req.getSortOrder() != null) logo.setSortOrder(req.getSortOrder());
            if (req.getIsActive() != null) logo.setIsActive(req.getIsActive());
            return fromUnion(unionLogoRepo.save(logo));
        }
        var logo = datawareLogoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("로고를 찾을 수 없습니다: " + id));
        logo.setName(req.getName());
        logo.setLogoUrl(req.getLogoUrl());
        if (req.getSortOrder() != null) logo.setSortOrder(req.getSortOrder());
        if (req.getIsActive() != null) logo.setIsActive(req.getIsActive());
        return fromDataware(datawareLogoRepo.save(logo));
    }

    @Transactional
    public void deleteLogo(String site, Long id) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) { unionLogoRepo.deleteById(id); }
        else { datawareLogoRepo.deleteById(id); }
    }

    private ClientLogoAdminResponse fromUnion(kr.co.unionsystems.union.entity.ClientLogo l) {
        return ClientLogoAdminResponse.builder()
                .id(l.getId()).name(l.getName()).logoUrl(l.getLogoUrl())
                .sortOrder(l.getSortOrder()).isActive(l.getIsActive())
                .createdAt(l.getCreatedAt()).build();
    }

    private ClientLogoAdminResponse fromDataware(kr.co.unionsystems.dataware.entity.ClientLogo l) {
        return ClientLogoAdminResponse.builder()
                .id(l.getId()).name(l.getName()).logoUrl(l.getLogoUrl())
                .sortOrder(l.getSortOrder()).isActive(l.getIsActive())
                .createdAt(l.getCreatedAt()).build();
    }
}
