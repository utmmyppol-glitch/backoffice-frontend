package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.Inquiry;
import kr.co.unionsystems.union.entity.Inquiry.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("unionInquiryRepository")
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    Page<Inquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Inquiry> findByStatus(InquiryStatus status);

    List<Inquiry> findByAssignee(String assignee);
}
