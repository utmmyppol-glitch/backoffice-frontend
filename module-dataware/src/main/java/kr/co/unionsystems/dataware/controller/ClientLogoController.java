package kr.co.unionsystems.dataware.controller;

import kr.co.unionsystems.dataware.entity.ClientLogo;
import kr.co.unionsystems.dataware.repository.ClientLogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("datawareClientLogoController")
@RequestMapping("/api/dataware")
@RequiredArgsConstructor
public class ClientLogoController {

    private final ClientLogoRepository clientLogoRepository;

    @GetMapping("/client-logos")
    public ResponseEntity<List<ClientLogo>> getClientLogos() {
        return ResponseEntity.ok(clientLogoRepository.findByIsActiveTrueOrderBySortOrderAsc());
    }
}
