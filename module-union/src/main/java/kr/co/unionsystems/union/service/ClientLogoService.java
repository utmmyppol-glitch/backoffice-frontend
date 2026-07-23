package kr.co.unionsystems.union.service;

import kr.co.unionsystems.union.entity.ClientLogo;
import kr.co.unionsystems.union.repository.ClientLogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("unionClientLogoService")
@RequiredArgsConstructor
public class ClientLogoService {

    private final ClientLogoRepository clientLogoRepository;

    @Transactional(readOnly = true)
    public List<ClientLogo> getActiveLogos() {
        return clientLogoRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }
}
