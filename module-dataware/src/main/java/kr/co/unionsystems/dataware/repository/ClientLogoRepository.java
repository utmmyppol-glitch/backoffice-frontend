package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.ClientLogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("datawareClientLogoRepository")
public interface ClientLogoRepository extends JpaRepository<ClientLogo, Long> {

    List<ClientLogo> findByIsActiveTrueOrderBySortOrderAsc();
}
