package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.ProductAdminRequest;
import kr.co.unionsystems.admin.dto.ProductAdminResponse;
import kr.co.unionsystems.admin.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/{site}/products")
@RequiredArgsConstructor
public class ProductAdminController {

    private final AdminProductService adminProductService;

    @GetMapping
    public ResponseEntity<List<ProductAdminResponse>> getProducts(@PathVariable String site) {
        return ResponseEntity.ok(adminProductService.getProducts(site));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductAdminResponse> getProduct(
            @PathVariable String site, @PathVariable Long id) {
        return ResponseEntity.ok(adminProductService.getProduct(site, id));
    }

    @PostMapping
    public ResponseEntity<ProductAdminResponse> createProduct(
            @PathVariable String site, @Valid @RequestBody ProductAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminProductService.createProduct(site, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductAdminResponse> updateProduct(
            @PathVariable String site, @PathVariable Long id,
            @Valid @RequestBody ProductAdminRequest request) {
        return ResponseEntity.ok(adminProductService.updateProduct(site, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String site, @PathVariable Long id) {
        adminProductService.deleteProduct(site, id);
        return ResponseEntity.noContent().build();
    }
}
