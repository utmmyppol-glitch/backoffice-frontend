package kr.co.unionsystems.admin.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Actuator
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ── public menu tree (header navigation) ──
                        .requestMatchers(HttpMethod.GET, "/api/union/menus").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/menus").permitAll()

                        // ── module-union public GET ──
                        .requestMatchers(HttpMethod.GET, "/api/union/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/union/customer-stories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/union/banners/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/union/client-logos/**").permitAll()
                        // module-union public POST
                        .requestMatchers(HttpMethod.POST, "/api/union/inquiries").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/union/downloads").permitAll()
                        // module-union admin-only
                        .requestMatchers(HttpMethod.POST, "/api/union/posts/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/union/posts/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/union/posts/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/union/customer-stories/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/union/customer-stories/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/union/customer-stories/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/union/inquiries/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/union/inquiries/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/union/banners/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/union/banners/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/union/banners/**").authenticated()

                        // ── module-dataware public GET ──
                        .requestMatchers(HttpMethod.GET, "/api/dataware/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/customer-stories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/banners/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/client-logos/**").permitAll()
                        // module-dataware public POST
                        .requestMatchers(HttpMethod.POST, "/api/dataware/inquiries").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/dataware/downloads").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/dataware/educations").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/dataware/seminars").permitAll()
                        // module-dataware admin-only
                        .requestMatchers(HttpMethod.POST, "/api/dataware/products/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/dataware/products/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/dataware/products/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/dataware/posts/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/dataware/posts/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/dataware/posts/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/dataware/customer-stories/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/dataware/customer-stories/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/dataware/customer-stories/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/inquiries/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/dataware/inquiries/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/educations/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/dataware/seminars/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/dataware/banners/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/dataware/banners/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/dataware/banners/**").authenticated()

                        // ── module-admin ──
                        .requestMatchers(HttpMethod.POST, "/api/admin/login").permitAll()
                        .requestMatchers("/api/admin/**").authenticated()

                        .anyRequest().authenticated()
                )
                .httpBasic(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
