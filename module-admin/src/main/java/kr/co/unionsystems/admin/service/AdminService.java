package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.config.JwtTokenProvider;
import kr.co.unionsystems.admin.dto.LoginRequest;
import kr.co.unionsystems.admin.dto.LoginResponse;
import kr.co.unionsystems.admin.entity.Admin;
import kr.co.unionsystems.admin.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public Optional<LoginResponse> authenticate(LoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (admin == null || !passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return Optional.empty();
        }

        log.info("Admin login successful: {}", request.getUsername());

        String siteName = admin.getSite() != null ? admin.getSite().name() : null;
        String token = jwtTokenProvider.generateToken(
                admin.getId(), admin.getUsername(), admin.getRole().name(), siteName);

        return Optional.of(LoginResponse.builder()
                .message("로그인 성공")
                .token(token)
                .username(admin.getUsername())
                .role(admin.getRole().name())
                .site(siteName)
                .build());
    }
}
