package kr.co.unionsystems.union.service;

import kr.co.unionsystems.union.dto.CustomerStoryResponse;
import kr.co.unionsystems.union.entity.CustomerStory;
import kr.co.unionsystems.union.repository.CustomerStoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("unionCustomerStoryService")
@RequiredArgsConstructor
@Slf4j
public class CustomerStoryService {

    private final CustomerStoryRepository customerStoryRepository;

    @Transactional(readOnly = true)
    public Page<CustomerStoryResponse> getStories(String industry, Pageable pageable) {
        if (industry != null && !industry.isEmpty()) {
            return customerStoryRepository.findByIndustryAndPublishedTrueOrderByCreatedAtDesc(industry, pageable)
                    .map(CustomerStoryResponse::from);
        }
        return customerStoryRepository.findByPublishedTrueOrderByCreatedAtDesc(pageable)
                .map(CustomerStoryResponse::from);
    }

    @Transactional
    public CustomerStoryResponse createStory(CustomerStory story) {
        CustomerStory saved = customerStoryRepository.save(story);
        log.info("Customer story created: id={}, company={}", saved.getId(), saved.getCompany());
        return CustomerStoryResponse.from(saved);
    }

    @Transactional
    public CustomerStoryResponse updateStory(Long id, CustomerStory storyData) {
        CustomerStory story = customerStoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("고객사례를 찾을 수 없습니다: " + id));

        story.setCompany(storyData.getCompany());
        story.setIndustry(storyData.getIndustry());
        story.setTitle(storyData.getTitle());
        story.setContent(storyData.getContent());
        story.setThumbnailUrl(storyData.getThumbnailUrl());
        story.setLogoUrl(storyData.getLogoUrl());
        story.setPublished(storyData.getPublished());

        CustomerStory updated = customerStoryRepository.save(story);
        log.info("Customer story updated: id={}", id);
        return CustomerStoryResponse.from(updated);
    }

    @Transactional
    public void deleteStory(Long id) {
        if (!customerStoryRepository.existsById(id)) {
            throw new IllegalArgumentException("고객사례를 찾을 수 없습니다: " + id);
        }
        customerStoryRepository.deleteById(id);
        log.info("Customer story deleted: id={}", id);
    }
}
