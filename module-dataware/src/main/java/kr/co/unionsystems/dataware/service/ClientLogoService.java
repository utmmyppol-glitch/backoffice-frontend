package kr.co.unionsystems.dataware.service;

import kr.co.unionsystems.dataware.entity.ClientLogo;
import kr.co.unionsystems.dataware.repository.ClientLogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("datawareClientLogoService")
@RequiredArgsConstructor
public class ClientLogoService {

    private final ClientLogoRepository clientLogoRepository;

    @Transactional(readOnly = true)
    public List<ClientLogo> getActiveLogos() {
        return clientLogoRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }
}
