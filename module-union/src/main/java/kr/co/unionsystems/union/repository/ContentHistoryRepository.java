package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.ContentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("unionContentHistoryRepository")
public interface ContentHistoryRepository extends JpaRepository<ContentHistory, Long> {

    List<ContentHistory> findByContentIdOrderByEditedAtDesc(Long contentId);
}
