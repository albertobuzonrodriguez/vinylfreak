package backend.api.backend_api.repository;

import backend.api.backend_api.model.Vinilo;
import backend.api.backend_api.model.ColeccionItem;
import backend.api.backend_api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.Collection;

public interface ViniloRepository extends JpaRepository<Vinilo, Long> {

    // Búsquedas estándar
    List<Vinilo> findByArtistaContainingIgnoreCase(String artista);

    List<Vinilo> findByTituloContainingIgnoreCase(String titulo);

    Optional<Vinilo> findByDiscogsId(Long discogsId);

    // --- CORRECCIÓN AQUÍ ---
    // El método debe devolver List<Vinilo>, no List<Usuario>
    List<Vinilo> findByUsuario(Usuario usuario);

    // --- EL CORAZÓN DEL FEED SOCIAL ---
    // Esta query funcionará siempre que en la entidad Vinilo tengas: private
    // Usuario usuario;
    // ViniloRepository.java (o puedes ponerlo en ColeccionRepository si prefieres)
    @Query("SELECT c FROM ColeccionItem c WHERE c.usuario IN :seguidos ORDER BY c.id DESC")
    List<ColeccionItem> findFeedBySeguidores(@Param("seguidos") Collection<Usuario> seguidos);
}