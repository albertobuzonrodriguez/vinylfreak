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

    /**
     * Añade un vinilo desde el buscador de Discogs a la colección del usuario.
     */
    @PostMapping("/add-from-discogs")
    public ResponseEntity<ColeccionItem> añadirDesdeDiscogs(
            @RequestBody Vinilo vinilo, 
            @RequestParam Long usuarioId,
            @RequestParam String estado) {
        
        try {
            ColeccionItem nuevoItem = coleccionService.agregarDesdeDiscogs(vinilo, usuarioId, estado);
            return ResponseEntity.ok(nuevoItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene todos los ítems de la biblioteca de un usuario específico.
     */
    @GetMapping("/usuario/{id}")
    public List<ColeccionItem> verBiblioteca(@PathVariable Long id) {
        // Asegúrate de que el método en ColeccionService se llame exactamente así
        return coleccionService.obtenerBibliotecaUsuario(id);
    }

    /**
     * Elimina un ítem de la colección.
     */
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarItem(@PathVariable Long id) {
        try {
            coleccionService.eliminarPorId(id); 
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el ítem a eliminar");
        }
    }
}