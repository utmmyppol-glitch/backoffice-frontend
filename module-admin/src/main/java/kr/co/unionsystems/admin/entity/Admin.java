package kr.co.unionsystems.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins", schema = "common")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AdminRole role = AdminRole.VIEWER;

    @Enumerated(EnumType.STRING)
    @Column
    private AdminSite site;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum AdminRole {
        SUPER, EDITOR, VIEWER
    }

    public enum AdminSite {
        UNION, DATAWARE
    }
}
