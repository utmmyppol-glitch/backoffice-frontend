package kr.co.unionsystems.union.repository;

import kr.co.unionsystems.union.entity.Post;
import kr.co.unionsystems.union.entity.Post.PostCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("unionPostRepository")
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<Post> findByCategoryAndPublishedTrueOrderByCreatedAtDesc(PostCategory category, Pageable pageable);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Post> findByCategoryOrderByCreatedAtDesc(PostCategory category, Pageable pageable);
}
