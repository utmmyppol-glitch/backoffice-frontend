package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.dto.DownloadRequest;
import kr.co.unionsystems.dataware.dto.DownloadResponse;
import kr.co.unionsystems.dataware.entity.Download;
import kr.co.unionsystems.dataware.repository.DownloadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("datawareDownloadService")
@RequiredArgsConstructor
@Slf4j
public class DownloadService {

    private final DownloadRepository downloadRepository;

    @Transactional
    public Download submitDownload(DownloadRequest request) {
        Download download = Download.builder()
                .name(request.getName())
                .company(request.getCompany())
                .phone(request.getPhone())
                .email(request.getEmail())
                .fileType(request.getFileType())
                .consentPrivacy(request.getConsentPrivacy())
                .consentThirdParty(request.getConsentThirdParty())
                .consentMarketing(request.getConsentMarketing())
                .build();
        log.info("다운로드 신청: {} ({})", request.getName(), request.getCompany());
        return downloadRepository.save(download);
    }

    @Transactional(readOnly = true)
    public Page<DownloadResponse> getDownloads(Pageable pageable) {
        return downloadRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(DownloadResponse::from);
    }
}
