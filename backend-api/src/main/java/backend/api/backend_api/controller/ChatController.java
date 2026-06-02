package backend.api.backend_api.controller;

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
// ─── SEGURIDAD CORS UNIFICADA PARA PRODUCCIÓN ─────────────────────────
@CrossOrigin(origins = {
    "http://localhost:4200", 
    "https://vinylfreak.onrender.com",
    "https://vinylfreak-frontend.onrender.com"
})
public class ChatController {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/api/mensajes/historial") 
    public List<Mensaje> obtenerHistorial(@RequestParam String u1, @RequestParam String u2) {
        return mensajeRepository.findChatHistory(u1, u2);
    }

    @GetMapping("/api/mensajes/conversaciones/{username}")
    public List<Mensaje> obtenerConversaciones(@PathVariable String username) {
        return mensajeRepository.findByRemitenteUsernameOrDestinatarioUsernameOrderByFechaEnvioDesc(username, username);
    }

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