package kr.co.unionsystems.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String message;
    private String username;
    private String role;
    private String site;
}
