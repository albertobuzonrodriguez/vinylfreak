package backend.api.backend_api.controller;

// IMPORTANTE: Asegúrate de que este sea el único import de Notificacion
import backend.api.backend_api.model.Notificacion; 
import backend.api.backend_api.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificacionController {

    @Autowired
    private NotificacionRepository notificacionRepository; // La variable debe ser en minúscula

    @GetMapping("/{username}")
    public List<Notificacion> obtenerNotificaciones(@PathVariable String username) {
        // Usa la variable inyectada 'notificacionRepository', NO el nombre de la clase
        return notificacionRepository.findByUsernameDestinoOrderByFechaDesc(username);
    }

    @PostMapping("/marcar-leidas/{username}")
    public void leerTodas(@PathVariable String username) {
        List<Notificacion> lista = notificacionRepository.findByUsernameDestinoOrderByFechaDesc(username);
        lista.forEach(n -> n.setLeida(true));
        notificacionRepository.saveAll(lista);
    }
}