package backend.api.backend_api.controller;

import backend.api.backend_api.model.ColeccionItem;
import backend.api.backend_api.model.Comentario;
import backend.api.backend_api.model.Notificacion; 
import backend.api.backend_api.model.Usuario;
import backend.api.backend_api.model.Vinilo;
import backend.api.backend_api.repository.ColeccionRepository;
import backend.api.backend_api.repository.NotificacionRepository;
import backend.api.backend_api.repository.UsuarioRepository;
import backend.api.backend_api.repository.ViniloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/vinilos")
@CrossOrigin(origins = "http://localhost:4200")
public class ViniloController {

    @Autowired
    private ViniloRepository viniloRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ColeccionRepository coleccionRepository;
    @Autowired
    private NotificacionRepository notificacionRepository;

    @GetMapping("/feed/{username}")
    public ResponseEntity<List<ColeccionItem>> obtenerFeed(@PathVariable String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Set<Usuario> seguidos = usuario.getSiguiendo();
        if (seguidos.isEmpty()) return ResponseEntity.ok(List.of());
        
        List<ColeccionItem> feed = viniloRepository.findFeedBySeguidores(seguidos);
        return ResponseEntity.ok(feed);
    }

    @PostMapping("/{itemId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long itemId, @RequestParam Long usuarioId) {
        ColeccionItem item = coleccionRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        Usuario usuarioQueDaLike = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (item.getLikesUsuarios().contains(usuarioId)) {
            item.getLikesUsuarios().remove(usuarioId);
        } else {
            item.getLikesUsuarios().add(usuarioId);
            
            // 🔔 NOTIFICACIÓN: Solo si el que da like no es el dueño
            if (!item.getUsuario().getId().equals(usuarioId)) {
                Notificacion n = new Notificacion();
                n.setUsernameDestino(item.getUsuario().getUsername());
                n.setUsernameOrigen(usuarioQueDaLike.getUsername());
                n.setMensaje(usuarioQueDaLike.getUsername() + " ha dado Me Gusta a tu vinilo: " + item.getVinilo().getTitulo());
                n.setFecha(LocalDateTime.now());
                n.setLeida(false);
                notificacionRepository.save(n);
            }
        }

        coleccionRepository.save(item);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{itemId}/comentar")
    public ResponseEntity<Comentario> agregarComentario(@PathVariable Long itemId, @RequestBody Comentario comentario) {
        ColeccionItem item = coleccionRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        // Asegúrate de que el comentario tiene la fecha actual
        if (comentario.getFecha() == null) {
            comentario.setFecha(LocalDateTime.now());
        }

        item.getComentarios().add(comentario);
        coleccionRepository.save(item);

        // 🔔 NOTIFICACIÓN: Al dueño del vinilo si el comentario es de otro
        if (!item.getUsuario().getUsername().equals(comentario.getUsername())) {
            Notificacion n = new Notificacion();
            n.setUsernameDestino(item.getUsuario().getUsername());
            n.setUsernameOrigen(comentario.getUsername());
            n.setMensaje(comentario.getUsername() + " ha comentado en tu vinilo: " + item.getVinilo().getTitulo());
            n.setFecha(LocalDateTime.now());
            n.setLeida(false);
            notificacionRepository.save(n);
        }

        return ResponseEntity.ok(comentario);
    }
}