package backend.api.backend_api.repository;

import backend.api.backend_api.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsernameDestinoOrderByFechaDesc(String username);
    long countByUsernameDestinoAndLeidaFalse(String username);
}