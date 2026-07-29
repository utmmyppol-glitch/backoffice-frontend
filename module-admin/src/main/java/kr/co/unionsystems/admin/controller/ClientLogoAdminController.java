package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.ClientLogoAdminRequest;
import kr.co.unionsystems.admin.dto.ClientLogoAdminResponse;
import kr.co.unionsystems.admin.service.AdminClientLogoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/{site}/client-logos")
@RequiredArgsConstructor
public class ClientLogoAdminController {

    private final AdminClientLogoService adminClientLogoService;

    @GetMapping
    public ResponseEntity<List<ClientLogoAdminResponse>> getLogos(@PathVariable String site) {
        return ResponseEntity.ok(adminClientLogoService.getLogos(site));
    }

    @PostMapping
    public ResponseEntity<ClientLogoAdminResponse> createLogo(
            @PathVariable String site, @Valid @RequestBody ClientLogoAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminClientLogoService.createLogo(site, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientLogoAdminResponse> updateLogo(
            @PathVariable String site, @PathVariable Long id,
            @Valid @RequestBody ClientLogoAdminRequest request) {
        return ResponseEntity.ok(adminClientLogoService.updateLogo(site, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLogo(
            @PathVariable String site, @PathVariable Long id) {
        adminClientLogoService.deleteLogo(site, id);
        return ResponseEntity.noContent().build();
    }
}
