package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.ContentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("datawareContentHistoryRepository")
public interface ContentHistoryRepository extends JpaRepository<ContentHistory, Long> {

    List<ContentHistory> findByContentIdOrderByEditedAtDesc(Long contentId);
}
