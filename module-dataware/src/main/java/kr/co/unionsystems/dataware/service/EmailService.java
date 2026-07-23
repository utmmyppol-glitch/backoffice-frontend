package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.entity.Inquiry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service("datawareEmailService")
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendInquiryNotification(Inquiry inquiry) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("ud@unionsystems.co.kr");
            message.setSubject("[유니온데이터웨어] 새로운 도입문의가 접수되었습니다 - " + inquiry.getCompany());
            message.setText(String.format(
                    "새로운 도입문의가 접수되었습니다.\n\n" +
                    "이름: %s\n" +
                    "회사: %s\n" +
                    "연락처: %s\n" +
                    "이메일: %s\n" +
                    "관심 제품: %s\n" +
                    "제3자 제공 동의(엔코아): %s\n" +
                    "문의 내용:\n%s",
                    inquiry.getName(),
                    inquiry.getCompany(),
                    inquiry.getPhone(),
                    inquiry.getEmail(),
                    inquiry.getProduct() != null ? inquiry.getProduct() : "-",
                    inquiry.getConsentThirdParty() != null && inquiry.getConsentThirdParty() ? "동의" : "미동의",
                    inquiry.getMessage() != null ? inquiry.getMessage() : "-"
            ));
            mailSender.send(message);
            log.info("Inquiry notification email sent for inquiry id: {}", inquiry.getId());
        } catch (Exception e) {
            log.error("Failed to send inquiry notification email for inquiry id: {}", inquiry.getId(), e);
        }
    }
}
