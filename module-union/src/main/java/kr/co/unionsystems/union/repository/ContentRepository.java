package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("unionContentRepository")
public interface ContentRepository extends JpaRepository<Content, Long> {

    Optional<Content> findByMenuIdAndRegionKey(Long menuId, String regionKey);

    List<Content> findByMenuId(Long menuId);
}
