package backend.api.backend_api.controller; // Revisa que tu package sea correcto

import backend.api.backend_api.model.Mensaje;
import backend.api.backend_api.model.Usuario;
import backend.api.backend_api.repository.MensajeRepository;
import backend.api.backend_api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Para que Angular pueda conectar
public class ChatController {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Endpoint para el historial
    @GetMapping("/api/mensajes/historial") // 👈 Revisa que la ruta sea EXACTA a la de Angular
    public List<Mensaje> obtenerHistorial(@RequestParam String u1, @RequestParam String u2) {
        return mensajeRepository.findChatHistory(u1, u2);
    }

    // Endpoint para la lista lateral de conversaciones
    @GetMapping("/api/mensajes/conversaciones/{username}")
    public List<Mensaje> obtenerConversaciones(@PathVariable String username) {
        return mensajeRepository.findByRemitenteUsernameOrDestinatarioUsernameOrderByFechaEnvioDesc(username, username);
    }

    // Lógica de WebSockets para enviar mensajes
    @MessageMapping("/chat")
    @SendTo("/topic/mensajes")
    public Mensaje gestionarMensaje(Mensaje mensaje) {
        Usuario remitente = usuarioRepository.findByUsername(mensaje.getRemitente().getUsername()).orElse(null);
        Usuario destinatario = usuarioRepository.findByUsername(mensaje.getDestinatario().getUsername()).orElse(null);
        
        mensaje.setRemitente(remitente);
        mensaje.setDestinatario(destinatario);
        mensaje.setFechaEnvio(LocalDateTime.now());
        
        return mensajeRepository.save(mensaje);
    }
}