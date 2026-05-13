package backend.api.backend_api.repository;

import backend.api.backend_api.model.ColeccionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ColeccionRepository extends JpaRepository<ColeccionItem, Long> {

    @Query(value = "SELECT * FROM coleccion_items WHERE usuario_id = :usuarioId", nativeQuery = true)
    List<ColeccionItem> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}