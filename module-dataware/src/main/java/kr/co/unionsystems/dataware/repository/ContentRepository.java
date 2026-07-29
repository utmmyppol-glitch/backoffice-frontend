package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("datawareContentRepository")
public interface ContentRepository extends JpaRepository<Content, Long> {

    Optional<Content> findByMenuIdAndRegionKey(Long menuId, String regionKey);

    List<Content> findByMenuId(Long menuId);
}
