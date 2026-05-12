package backend.api.backend_api.controller;

import backend.api.backend_api.model.Vinilo;
import backend.api.backend_api.service.ViniloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vinilos")
@CrossOrigin(origins = "http://localhost:4200")
public class ViniloController {

    @Autowired
    private ViniloService viniloService;

    // Obtener todo el catálogo maestro (el que cargaremos masivamente)
    @GetMapping
    public List<Vinilo> listarVinilos() {
        return viniloService.obtenerTodos();
    }

    // Buscar un vinilo específico por su ID de Discogs (útil para Angular)
    @GetMapping("/discogs/{discogsId}")
    public Vinilo buscarPorDiscogsId(@PathVariable Long discogsId) {
        // .orElse(null) hará que si no lo encuentra, devuelva un vacío en lugar de un
        // error de tipos
        return viniloService.obtenerPorDiscogsId(discogsId).orElse(null);
    }
}