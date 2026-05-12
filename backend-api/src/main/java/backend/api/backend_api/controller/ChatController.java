package backend.api.backend_api.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import backend.api.backend_api.model.Mensaje;

@Controller
public class ChatController {

    @MessageMapping("/chat.enviar") // El cliente manda aquí
    @SendTo("/topic/publico") // Se retransmite a todos los suscritos
    public Mensaje enviarMensaje(Mensaje mensaje) {
        return mensaje;
    }
}