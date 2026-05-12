package backend.api.backend_api.repository;

import backend.api.backend_api.model.Vinilo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ViniloRepository extends JpaRepository<Vinilo, Long> {
    
    // Buscar discos por artista o título en nuestro catálogo local
    List<Vinilo> findByArtistaContainingIgnoreCase(String artista);
    List<Vinilo> findByTituloContainingIgnoreCase(String titulo);
    
    // Este método es el corazón de la integración con Discogs
    Optional<Vinilo> findByDiscogsId(Long discogsId);

}