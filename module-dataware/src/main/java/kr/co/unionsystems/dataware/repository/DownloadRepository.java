package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.Download;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("datawareDownloadRepository")
public interface DownloadRepository extends JpaRepository<Download, Long> {

    Page<Download> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
