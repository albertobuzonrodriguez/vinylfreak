package backend.api.backend_api.repository;

import backend.api.backend_api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Buscamos por username para el futuro Login
    Optional<Usuario> findByUsername(String username);

    Usuario findByEmailAndPassword(String email, String password);

    Usuario findByEmail(String email);
    List<Usuario> findByUsernameContainingIgnoreCase(String username);
    
}