package kr.co.unionsystems.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "kr.co.unionsystems")
@EntityScan(basePackages = "kr.co.unionsystems")
@EnableJpaRepositories(basePackages = "kr.co.unionsystems")
public class UnionBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(UnionBackendApplication.class, args);
    }
}
