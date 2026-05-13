package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Data
public class Notificacion {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String mensaje;
    private String usernameDestino; // Quién recibe la alerta
    private String usernameOrigen;  // Quién causó la acción (opcional)
    private boolean leida = false;
    private LocalDateTime fecha = LocalDateTime.now();
}