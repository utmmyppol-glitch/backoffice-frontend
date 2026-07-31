package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.Education;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("datawareEducationRepository")
public interface EducationRepository extends JpaRepository<Education, Long> {

    Page<Education> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
