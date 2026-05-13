package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "vinilos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vinilo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String artista;

    @Column(columnDefinition = "TEXT")
    private String sello;

    @Column(name = "anio_lanzamiento")
    private Integer anioLanzamiento;

    @Column(columnDefinition = "TEXT")
    private String genero;

    @Column(columnDefinition = "TEXT")
    private String estilo;

    @Column(name = "url_portada", columnDefinition = "TEXT")
    private String urlPortada;

    @Column(name = "discogs_id", unique = true)
    private Long discogsId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = true) // Cambiado a true para evitar errores 500 al crear
    @JsonIgnoreProperties({"coleccion", "siguiendo", "seguidores", "password"})
    private Usuario usuario;
}