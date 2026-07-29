package kr.co.unionsystems.admin.service;

import kr.co.unionsystems.admin.dto.PostAdminRequest;
import kr.co.unionsystems.admin.dto.PostAdminResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AdminPostService {

    private final kr.co.unionsystems.union.repository.PostRepository unionPostRepo;
    private final kr.co.unionsystems.dataware.repository.PostRepository datawarePostRepo;
    private final SiteAccessValidator siteAccessValidator;

    public AdminPostService(
            @Qualifier("unionPostRepository") kr.co.unionsystems.union.repository.PostRepository unionPostRepo,
            @Qualifier("datawarePostRepository") kr.co.unionsystems.dataware.repository.PostRepository datawarePostRepo,
            SiteAccessValidator siteAccessValidator) {
        this.unionPostRepo = unionPostRepo;
        this.datawarePostRepo = datawarePostRepo;
        this.siteAccessValidator = siteAccessValidator;
    }

    @Transactional(readOnly = true)
    public Page<PostAdminResponse> getPosts(String site, Pageable pageable) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            return unionPostRepo.findAllByOrderByCreatedAtDesc(pageable).map(this::fromUnion);
        }
        return datawarePostRepo.findAllByOrderByCreatedAtDesc(pageable).map(this::fromDataware);
    }

    @Transactional(readOnly = true)
    public PostAdminResponse getPost(String site, Long id) {
        siteAccessValidator.validateSiteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            return unionPostRepo.findById(id).map(this::fromUnion)
                    .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
        }
        return datawarePostRepo.findById(id).map(this::fromDataware)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
    }

    @Transactional
    public PostAdminResponse createPost(String site, PostAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var post = kr.co.unionsystems.union.entity.Post.builder()
                    .title(req.getTitle()).content(req.getContent()).excerpt(req.getExcerpt())
                    .category(kr.co.unionsystems.union.entity.Post.PostCategory.valueOf(req.getCategory()))
                    .thumbnailUrl(req.getThumbnailUrl())
                    .published(req.getPublished() != null ? req.getPublished() : false)
                    .build();
            return fromUnion(unionPostRepo.save(post));
        }
        var post = kr.co.unionsystems.dataware.entity.Post.builder()
                .title(req.getTitle()).content(req.getContent()).excerpt(req.getExcerpt())
                .category(kr.co.unionsystems.dataware.entity.Post.PostCategory.valueOf(req.getCategory()))
                .thumbnailUrl(req.getThumbnailUrl())
                .published(req.getPublished() != null ? req.getPublished() : false)
                .build();
        return fromDataware(datawarePostRepo.save(post));
    }

    @Transactional
    public PostAdminResponse updatePost(String site, Long id, PostAdminRequest req) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) {
            var post = unionPostRepo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
            post.setTitle(req.getTitle());
            post.setContent(req.getContent());
            post.setExcerpt(req.getExcerpt());
            if (req.getCategory() != null) post.setCategory(kr.co.unionsystems.union.entity.Post.PostCategory.valueOf(req.getCategory()));
            post.setThumbnailUrl(req.getThumbnailUrl());
            if (req.getPublished() != null) post.setPublished(req.getPublished());
            return fromUnion(unionPostRepo.save(post));
        }
        var post = datawarePostRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + id));
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setExcerpt(req.getExcerpt());
        if (req.getCategory() != null) post.setCategory(kr.co.unionsystems.dataware.entity.Post.PostCategory.valueOf(req.getCategory()));
        post.setThumbnailUrl(req.getThumbnailUrl());
        if (req.getPublished() != null) post.setPublished(req.getPublished());
        return fromDataware(datawarePostRepo.save(post));
    }

    @Transactional
    public void deletePost(String site, Long id) {
        siteAccessValidator.validateWriteAccess(site);
        String s = siteAccessValidator.normalizeSite(site);
        if ("union".equals(s)) { unionPostRepo.deleteById(id); }
        else { datawarePostRepo.deleteById(id); }
    }

    private PostAdminResponse fromUnion(kr.co.unionsystems.union.entity.Post p) {
        return PostAdminResponse.builder()
                .id(p.getId()).title(p.getTitle()).content(p.getContent()).excerpt(p.getExcerpt())
                .category(p.getCategory().name()).thumbnailUrl(p.getThumbnailUrl())
                .published(p.getPublished()).viewCount(p.getViewCount())
                .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }

    private PostAdminResponse fromDataware(kr.co.unionsystems.dataware.entity.Post p) {
        return PostAdminResponse.builder()
                .id(p.getId()).title(p.getTitle()).content(p.getContent()).excerpt(p.getExcerpt())
                .category(p.getCategory().name()).thumbnailUrl(p.getThumbnailUrl())
                .published(p.getPublished()).viewCount(p.getViewCount())
                .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }
}
