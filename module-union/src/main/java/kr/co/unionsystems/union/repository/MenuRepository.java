package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("unionMenuRepository")
public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findAllByOrderBySortOrderAsc();

    List<Menu> findByIsExposedTrueOrderBySortOrderAsc();

    List<Menu> findByParentIdOrderBySortOrderAsc(Long parentId);

    List<Menu> findByParentIdIsNullOrderBySortOrderAsc();
}
