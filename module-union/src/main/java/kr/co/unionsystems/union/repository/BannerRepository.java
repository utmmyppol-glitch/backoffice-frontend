package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.Banner;
import kr.co.unionsystems.union.entity.Banner.BannerPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("unionBannerRepository")
public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findByPositionAndIsActiveTrueOrderBySortOrderAsc(BannerPosition position);

    List<Banner> findByIsActiveTrueOrderBySortOrderAsc();
}
