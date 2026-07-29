package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.MenuRequest;
import kr.co.unionsystems.admin.dto.MenuResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminMenuService {

    private final kr.co.unionsystems.union.repository.MenuRepository unionMenuRepo;
    private final kr.co.unionsystems.dataware.repository.MenuRepository datawareMenuRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminMenuService(
            @Qualifier("unionMenuRepository") kr.co.unionsystems.union.repository.MenuRepository unionMenuRepo,
            @Qualifier("datawareMenuRepository") kr.co.unionsystems.dataware.repository.MenuRepository datawareMenuRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionMenuRepo = unionMenuRepo;
        this.datawareMenuRepo = datawareMenuRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenuTree(String site) {
        siteAccessValidator.validateSiteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            return buildTree(unionMenuRepo.findAllByOrderBySortOrderAsc().stream()
                    .map(this::toUnionResponse).collect(Collectors.toList()));
        } else {
            return buildTree(datawareMenuRepo.findAllByOrderBySortOrderAsc().stream()
                    .map(this::toDatawareResponse).collect(Collectors.toList()));
        }
    }

    @Transactional
    public MenuResponse createMenu(String site, MenuRequest request) {
        siteAccessValidator.validateWriteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            kr.co.unionsystems.union.entity.Menu menu = kr.co.unionsystems.union.entity.Menu.builder()
                    .parentId(request.getParentId())
                    .name(request.getName())
                    .url(request.getUrl())
                    .menuType(request.getMenuType() != null ?
                            kr.co.unionsystems.union.entity.Menu.MenuType.valueOf(request.getMenuType()) :
                            kr.co.unionsystems.union.entity.Menu.MenuType.CONTENT)
                    .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                    .depth(request.getDepth() != null ? request.getDepth() : 0)
                    .isExposed(request.getIsExposed() != null ? request.getIsExposed() : true)
                    .build();
            return toUnionResponse(unionMenuRepo.save(menu));
        } else {
            kr.co.unionsystems.dataware.entity.Menu menu = kr.co.unionsystems.dataware.entity.Menu.builder()
                    .parentId(request.getParentId())
                    .name(request.getName())
                    .url(request.getUrl())
                    .menuType(request.getMenuType() != null ?
                            kr.co.unionsystems.dataware.entity.Menu.MenuType.valueOf(request.getMenuType()) :
                            kr.co.unionsystems.dataware.entity.Menu.MenuType.CONTENT)
                    .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                    .depth(request.getDepth() != null ? request.getDepth() : 0)
                    .isExposed(request.getIsExposed() != null ? request.getIsExposed() : true)
                    .build();
            return toDatawareResponse(datawareMenuRepo.save(menu));
        }
    }

    @Transactional
    public MenuResponse updateMenu(String site, Long id, MenuRequest request) {
        siteAccessValidator.validateWriteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            kr.co.unionsystems.union.entity.Menu menu = unionMenuRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + id));
            menu.setParentId(request.getParentId());
            menu.setName(request.getName());
            menu.setUrl(request.getUrl());
            if (request.getMenuType() != null) {
                menu.setMenuType(kr.co.unionsystems.union.entity.Menu.MenuType.valueOf(request.getMenuType()));
            }
            if (request.getSortOrder() != null) menu.setSortOrder(request.getSortOrder());
            if (request.getDepth() != null) menu.setDepth(request.getDepth());
            if (request.getIsExposed() != null) menu.setIsExposed(request.getIsExposed());
            return toUnionResponse(unionMenuRepo.save(menu));
        } else {
            kr.co.unionsystems.dataware.entity.Menu menu = datawareMenuRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + id));
            menu.setParentId(request.getParentId());
            menu.setName(request.getName());
            menu.setUrl(request.getUrl());
            if (request.getMenuType() != null) {
                menu.setMenuType(kr.co.unionsystems.dataware.entity.Menu.MenuType.valueOf(request.getMenuType()));
            }
            if (request.getSortOrder() != null) menu.setSortOrder(request.getSortOrder());
            if (request.getDepth() != null) menu.setDepth(request.getDepth());
            if (request.getIsExposed() != null) menu.setIsExposed(request.getIsExposed());
            return toDatawareResponse(datawareMenuRepo.save(menu));
        }
    }

    @Transactional
    public void deleteMenu(String site, Long id) {
        siteAccessValidator.validateWriteAccess(site);
        String normalized = siteAccessValidator.normalizeSite(site);

        if ("union".equals(normalized)) {
            unionMenuRepo.deleteById(id);
        } else {
            datawareMenuRepo.deleteById(id);
        }
    }

    private List<MenuResponse> buildTree(List<MenuResponse> flatList) {
        Map<Long, MenuResponse> map = new LinkedHashMap<>();
        for (MenuResponse m : flatList) {
            m.setChildren(new ArrayList<>());
            map.put(m.getId(), m);
        }
        List<MenuResponse> roots = new ArrayList<>();
        for (MenuResponse m : flatList) {
            if (m.getParentId() == null) {
                roots.add(m);
            } else {
                MenuResponse parent = map.get(m.getParentId());
                if (parent != null) {
                    parent.getChildren().add(m);
                } else {
                    roots.add(m);
                }
            }
        }
        return roots;
    }

    private MenuResponse toUnionResponse(kr.co.unionsystems.union.entity.Menu menu) {
        return MenuResponse.builder()
                .id(menu.getId())
                .parentId(menu.getParentId())
                .name(menu.getName())
                .url(menu.getUrl())
                .menuType(menu.getMenuType().name())
                .sortOrder(menu.getSortOrder())
                .depth(menu.getDepth())
                .isExposed(menu.getIsExposed())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }

    private MenuResponse toDatawareResponse(kr.co.unionsystems.dataware.entity.Menu menu) {
        return MenuResponse.builder()
                .id(menu.getId())
                .parentId(menu.getParentId())
                .name(menu.getName())
                .url(menu.getUrl())
                .menuType(menu.getMenuType().name())
                .sortOrder(menu.getSortOrder())
                .depth(menu.getDepth())
                .isExposed(menu.getIsExposed())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
