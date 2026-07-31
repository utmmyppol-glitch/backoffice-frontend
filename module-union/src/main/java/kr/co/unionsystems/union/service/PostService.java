package kr.co.unionsystems.union.service;

import kr.co.unionsystems.union.dto.PostResponse;
import kr.co.unionsystems.union.entity.Post;
import kr.co.unionsystems.union.entity.Post.PostCategory;
import kr.co.unionsystems.union.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("unionPostService")
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public Page<PostResponse> getPosts(String category, Pageable pageable) {
        if (category != null && !category.isEmpty()) {
            PostCategory postCategory = PostCategory.valueOf(category.toUpperCase());
            return postRepository.findByCategoryAndPublishedTrueOrderByCreatedAtDesc(postCategory, pageable)
                    .map(PostResponse::from);
        }
        return postRepository.findByPublishedTrueOrderByCreatedAtDesc(pageable)
                .map(PostResponse::from);
    }

    @Transactional
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return PostResponse.from(post);
    }

    @Transactional
    public PostResponse createPost(Post post) {
        Post saved = postRepository.save(post);
        log.info("Post created: id={}, title={}", saved.getId(), saved.getTitle());
        return PostResponse.from(saved);
    }

    @Transactional
    public PostResponse updatePost(Long id, Post postData) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));

        post.setTitle(postData.getTitle());
        post.setContent(postData.getContent());
        post.setExcerpt(postData.getExcerpt());
        post.setCategory(postData.getCategory());
        post.setThumbnailUrl(postData.getThumbnailUrl());
        post.setPublished(postData.getPublished());

        Post updated = postRepository.save(post);
        log.info("Post updated: id={}", id);
        return PostResponse.from(updated);
    }

    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id);
        }
        postRepository.deleteById(id);
        log.info("Post deleted: id={}", id);
    }
}
