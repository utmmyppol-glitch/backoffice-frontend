package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.MenuRequest;
import kr.co.unionsystems.admin.dto.MenuResponse;
import kr.co.unionsystems.admin.service.AdminMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/{site}/menus")
@RequiredArgsConstructor
public class MenuAdminController {

    private final AdminMenuService adminMenuService;

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenuTree(@PathVariable String site) {
        return ResponseEntity.ok(adminMenuService.getMenuTree(site));
    }

    @PostMapping
    public ResponseEntity<MenuResponse> createMenu(
            @PathVariable String site,
            @Valid @RequestBody MenuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminMenuService.createMenu(site, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuResponse> updateMenu(
            @PathVariable String site,
            @PathVariable Long id,
            @Valid @RequestBody MenuRequest request) {
        return ResponseEntity.ok(adminMenuService.updateMenu(site, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(
            @PathVariable String site,
            @PathVariable Long id) {
        adminMenuService.deleteMenu(site, id);
        return ResponseEntity.noContent().build();
    }
}
