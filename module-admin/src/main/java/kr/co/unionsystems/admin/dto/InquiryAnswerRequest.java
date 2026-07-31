package kr.co.unionsystems.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InquiryAnswerRequest {
    private String status;
    private String assignee;
}
