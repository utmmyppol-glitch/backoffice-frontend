package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("unionDownloadRepository")
public interface DownloadRepository extends JpaRepository<Download, Long> {
}
