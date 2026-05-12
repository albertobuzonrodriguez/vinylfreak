package backend.api.backend_api.repository;

import backend.api.backend_api.model.ColeccionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ColeccionRepository extends JpaRepository<ColeccionItem, Long> {
    // Obtener todos los discos de un usuario específico
    List<ColeccionItem> findByUsuarioId(Long usuarioId);
}