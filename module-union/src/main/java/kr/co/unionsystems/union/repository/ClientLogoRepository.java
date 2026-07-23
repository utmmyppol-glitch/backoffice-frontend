package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.ClientLogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("unionClientLogoRepository")
public interface ClientLogoRepository extends JpaRepository<ClientLogo, Long> {

    List<ClientLogo> findByIsActiveTrueOrderBySortOrderAsc();
}
