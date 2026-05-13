package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "comentarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(nullable = false)
    private String username; // Guardamos el nombre del autor

    private LocalDateTime fecha = LocalDateTime.now();

    // No necesitamos @ManyToOne aquí si lo gestionamos desde ColeccionItem
    // para mantenerlo simple, pero es opcional.
}