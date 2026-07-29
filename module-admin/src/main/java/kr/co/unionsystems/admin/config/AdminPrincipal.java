package kr.co.unionsystems.admin.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminPrincipal {
    private final Long id;
    private final String username;
    private final String role;
    private final String site;
}
