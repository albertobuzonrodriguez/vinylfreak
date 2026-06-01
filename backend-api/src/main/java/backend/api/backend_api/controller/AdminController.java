package backend.api.backend_api.controller;

import backend.api.backend_api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ViniloRepository viniloRepository;
    @Autowired
    private ColeccionRepository coleccionRepository;

    // 1. Obtener estadísticas del sitio
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("usuariosTotales", usuarioRepository.count());
        stats.put("vinilosTotales", viniloRepository.count());
        stats.put("itemsColeccion", coleccionRepository.count());
        return ResponseEntity.ok(stats);
    }

    // 2. Banear/Eliminar un usuario
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}