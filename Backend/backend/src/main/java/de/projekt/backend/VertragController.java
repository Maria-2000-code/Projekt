package de.projekt.backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vertraege")
@CrossOrigin(origins = "http://localhost:5173") // Erlaubt den Zugriff vom React/Vite-Frontend
public class VertragController {

    private final VertragRepository vertragRepository;

    public VertragController(VertragRepository vertragRepository) {
        this.vertragRepository = vertragRepository;
    }

    // GET /api/vertraege - Alle Verträge abrufen
    @GetMapping
    public List<Vertrag> getAllVertraege() {
        return vertragRepository.findAll();
    }

    // POST /api/vertraege - Neuen Vertrag anlegen
    @PostMapping
    public Vertrag createVertrag(@RequestBody Vertrag vertrag) {
        return vertragRepository.save(vertrag);
    }
}