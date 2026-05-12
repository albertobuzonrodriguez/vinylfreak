package backend.api.backend_api.repository;

import backend.api.backend_api.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    @Query("SELECT m FROM Mensaje m WHERE " +
           "(m.remitente.username = :u1 AND m.destinatario.username = :u2) OR " +
           "(m.remitente.username = :u2 AND m.destinatario.username = :u1) " +
           "ORDER BY m.fechaEnvio ASC")
    List<Mensaje> findChatHistory(@Param("u1") String user1, @Param("u2") String user2);

    // Corregido también para que coincida con destinatario y fechaEnvio
    List<Mensaje> findByRemitenteUsernameOrDestinatarioUsernameOrderByFechaEnvioDesc(String remitente, String destinatario);
}