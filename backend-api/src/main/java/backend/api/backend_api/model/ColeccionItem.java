package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "coleccion_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColeccionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({ "coleccion", "siguiendo", "seguidores", "password", "email" })
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vinilo_id", nullable = false)
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    private Vinilo vinilo;

    @Column(nullable = false)
    private String estadoDisco;

    private String estadoPortada;
    private Double precioTasado;
    private Boolean enVenta = false;
    private String observaciones;

    @ElementCollection
    @CollectionTable(name = "item_likes", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "usuario_id")
    private Set<Long> likesUsuarios = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "item_id")
    private List<Comentario> comentarios = new ArrayList<>();
}