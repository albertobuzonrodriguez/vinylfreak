package backend.api.backend_api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "coleccion_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColeccionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación Muchos a Uno: Muchos items pueden pertenecer a un usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Relación Muchos a Uno: Muchos items pueden referenciar al mismo vinilo del catálogo
    @ManyToOne
    @JoinColumn(name = "vinilo_id", nullable = false)
    private Vinilo vinilo;

    // Campos específicos de la copia del usuario
    @Column(nullable = false)
    private String estadoDisco; // Ej: "Mint", "Near Mint", "VG+"

    private String estadoPortada;

    private Double precioTasado; // Importante para la funcionalidad de "tasar biblioteca"

    private Boolean enVenta = false; // Por defecto no está en venta

    @Column(length = 500)
    private String observaciones;
}