package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Data
// Evitamos recursividad en métodos automáticos de Lombok
@EqualsAndHashCode(exclude = {"siguiendo", "seguidores"})
@ToString(exclude = {"siguiendo", "seguidores"})
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String urlFotoPerfil; 

    @Column(columnDefinition = "TEXT") 
    private String biografia;

    // Relación: Usuarios a los que YO sigo
    @ManyToMany
    @JoinTable(
        name = "usuario_seguidores",
        joinColumns = @JoinColumn(name = "seguidor_id"),
        inverseJoinColumns = @JoinColumn(name = "seguido_id")
    )
    @JsonIgnore // No queremos cargar toda la red social en cada consulta de login
    private Set<Usuario> siguiendo = new HashSet<>();

    // Relación: Usuarios que ME siguen a mí
    @ManyToMany(mappedBy = "siguiendo")
    @JsonIgnore
    private Set<Usuario> seguidores = new HashSet<>();
}