package backend.api.backend_api.controller;

import backend.api.backend_api.model.Notificacion; 
import backend.api.backend_api.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
// ─── SEGURIDAD CORS UNIFICADA PARA PRODUCCIÓN ─────────────────────────
@CrossOrigin(origins = {
    "http://localhost:4200", 
    "https://vinylfreak.onrender.com",
    "https://vinylfreak-frontend.onrender.com"
})
public class NotificacionController {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @GetMapping("/{username}")
    public List<Notificacion> obtenerNotificaciones(@PathVariable String username) {
        return notificacionRepository.findByUsernameDestinoOrderByFechaDesc(username);
    }

    @PostMapping("/marcar-leidas/{username}")
    public void leerTodas(@PathVariable String username) {
        List<Notificacion> lista = notificacionRepository.findByUsernameDestinoOrderByFechaDesc(username);
        lista.forEach(n -> n.setLeida(true));
        notificacionRepository.saveAll(lista);
    }
}