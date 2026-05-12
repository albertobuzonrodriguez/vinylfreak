package backend.api.backend_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker simple para enviar mensajes a los clientes
        // Los clientes se suscribirán a rutas que empiecen por /topic
        config.enableSimpleBroker("/topic");
        
        // Prefijo para los mensajes que van del cliente al servidor (@MessageMapping)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // El punto de entrada para la conexión WebSocket
        registry.addEndpoint("/ws-vinyl")
                .setAllowedOrigins("http://localhost:4200") // 👈 Importante para Angular
                .withSockJS(); // 👈 Permite fallback si el navegador no soporta WebSockets
    }
}