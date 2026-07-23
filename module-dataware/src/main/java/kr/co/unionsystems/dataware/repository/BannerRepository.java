package kr.co.unionsystems.dataware.repository;

import kr.co.unionsystems.dataware.entity.Banner;
import kr.co.unionsystems.dataware.entity.Banner.BannerPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("datawareBannerRepository")
public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findByPositionAndIsActiveTrueOrderBySortOrderAsc(BannerPosition position);

    List<Banner> findByIsActiveTrueOrderBySortOrderAsc();
}
