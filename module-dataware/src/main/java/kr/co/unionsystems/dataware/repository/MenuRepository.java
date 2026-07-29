package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("datawareMenuRepository")
public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findAllByOrderBySortOrderAsc();

    List<Menu> findByParentIdOrderBySortOrderAsc(Long parentId);

    List<Menu> findByParentIdIsNullOrderBySortOrderAsc();
}
