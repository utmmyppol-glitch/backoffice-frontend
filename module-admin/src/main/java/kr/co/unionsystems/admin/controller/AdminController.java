package kr.co.unionsystems.admin.controller;

import jakarta.validation.Valid;
import kr.co.unionsystems.admin.dto.LoginRequest;
import kr.co.unionsystems.admin.dto.LoginResponse;
import kr.co.unionsystems.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return adminService.authenticate(request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(LoginResponse.builder()
                                .message("아이디 또는 비밀번호가 올바르지 않습니다")
                                .build()));
    }
}
