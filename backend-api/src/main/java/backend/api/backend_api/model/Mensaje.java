package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
@Data
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // El usuario que envía el mensaje
    @ManyToOne
    @JoinColumn(name = "remitente_id", nullable = false)
    private Usuario remitente;

    // El usuario que recibe el mensaje
    @ManyToOne
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    // Fecha y hora exacta del mensaje para ordenarlos en el chat
    private LocalDateTime fechaEnvio;

    // Útil para saber si el destinatario ya lo abrió
    private boolean leido = false;

    // Este campo es opcional, sirve para lógica de WebSockets si quieres 
    // diferenciar entre un mensaje de texto o una notificación de "conectado"
    @Transient 
    private String tipo; 

    // Constructor que asigna la fecha automáticamente al crear el objeto
    public Mensaje() {
        this.fechaEnvio = LocalDateTime.now();
    }
}