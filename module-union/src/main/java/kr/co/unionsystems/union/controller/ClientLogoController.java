package kr.co.unionsystems.union.controller;

import kr.co.unionsystems.union.entity.ClientLogo;
import kr.co.unionsystems.union.service.ClientLogoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("unionClientLogoController")
@RequestMapping("/api/union")
@RequiredArgsConstructor
public class ClientLogoController {

    private final ClientLogoService clientLogoService;

    @GetMapping("/client-logos")
    public ResponseEntity<List<ClientLogo>> getClientLogos() {
        return ResponseEntity.ok(clientLogoService.getActiveLogos());
    }
}
