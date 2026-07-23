package kr.co.unionsystems.admin.controller;

import kr.co.unionsystems.admin.entity.Admin;
import kr.co.unionsystems.admin.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Admin admin = adminRepository.findByUsername(username)
                .orElse(null);

        if (admin == null || !passwordEncoder.matches(password, admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "아이디 또는 비밀번호가 올바르지 않습니다"));
        }

        log.info("Admin login successful: {}", username);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "로그인 성공");
        response.put("username", admin.getUsername());
        response.put("role", admin.getRole().name());
        response.put("site", admin.getSite() != null ? admin.getSite().name() : null);

        return ResponseEntity.ok(response);
    }
}
