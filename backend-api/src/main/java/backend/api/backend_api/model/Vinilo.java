package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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

    @Column(columnDefinition = "TEXT") // Para sellos largos
    private String sello;

    @Column(name = "anio_lanzamiento")
    private Integer anioLanzamiento;

    @Column(columnDefinition = "TEXT") // Para géneros largos
    private String genero;

    @Column(columnDefinition = "TEXT") // Para estilos largos
    private String estilo;

    @Column(name = "url_portada", columnDefinition = "TEXT") // <--- ESTO ES CLAVE
    private String urlPortada;

    @Column(unique = true)
    private Long discogsId; // ID único de la API externa

}