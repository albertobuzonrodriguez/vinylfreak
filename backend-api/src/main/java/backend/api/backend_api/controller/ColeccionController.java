package backend.api.backend_api.controller;

import backend.api.backend_api.model.ColeccionItem;
import backend.api.backend_api.model.Vinilo;
import backend.api.backend_api.service.ColeccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/coleccion")
@CrossOrigin(origins = "http://localhost:4200")
public class ColeccionController {

    @Autowired
    private ColeccionService coleccionService;

    // MÉTODO NUEVO: Para añadir desde el buscador de Discogs
    // Recibe el objeto Vinilo en el cuerpo y los datos del usuario por parámetro
    @PostMapping("/add-from-discogs")
    public ResponseEntity<ColeccionItem> añadirDesdeDiscogs(
            @RequestBody Vinilo vinilo, 
            @RequestParam Long usuarioId,
            @RequestParam String estado) {
        
        ColeccionItem nuevoItem = coleccionService.agregarDesdeDiscogs(vinilo, usuarioId, estado);
        return ResponseEntity.ok(nuevoItem);
    }

    // Tu método original (por si quieres añadir discos manualmente)
    @PostMapping
    public ColeccionItem añadirDisco(@RequestBody ColeccionItem item) {
        return coleccionService.agregarAVitrina(item);
    }

    @GetMapping("/usuario/{id}")
    public List<ColeccionItem> verBiblioteca(@PathVariable Long id) {
        return coleccionService.obtenerBibliotecaUsuario(id);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarItem(@PathVariable Long id) {
        try {
            coleccionService.eliminarPorId(id); 
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el item");
        }
    }
}