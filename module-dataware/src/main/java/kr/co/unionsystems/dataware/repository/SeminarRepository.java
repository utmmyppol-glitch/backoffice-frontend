package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.Seminar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("datawareSeminarRepository")
public interface SeminarRepository extends JpaRepository<Seminar, Long> {

    Page<Seminar> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
