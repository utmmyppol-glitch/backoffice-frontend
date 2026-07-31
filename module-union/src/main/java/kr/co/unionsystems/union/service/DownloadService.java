package kr.co.unionsystems.union.service;

import kr.co.unionsystems.union.dto.DownloadRequest;
import kr.co.unionsystems.union.entity.Download;
import kr.co.unionsystems.union.repository.DownloadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("unionDownloadService")
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
                .consentMarketing(request.getConsentMarketing())
                .build();
        log.info("다운로드 신청: {} ({})", request.getName(), request.getCompany());
        return downloadRepository.save(download);
    }
}
