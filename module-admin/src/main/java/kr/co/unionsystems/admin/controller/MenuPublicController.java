package kr.co.unionsystems.admin.controller;

import kr.co.unionsystems.admin.dto.MenuResponse;
import kr.co.unionsystems.admin.service.AdminMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/{site}/menus")
@RequiredArgsConstructor
public class MenuPublicController {

    private final AdminMenuService adminMenuService;

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getPublicMenuTree(@PathVariable String site) {
        return ResponseEntity.ok(adminMenuService.getPublicMenuTree(site));
    }
}
