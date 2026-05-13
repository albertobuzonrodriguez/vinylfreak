package backend.api.backend_api.repository;

import backend.api.backend_api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Crucial para el Chat, Seguidores y Perfiles
    Optional<Usuario> findByUsername(String username);

    // Búsqueda para el buscador de la comunidad (Angular)
    List<Usuario> findByUsernameContainingIgnoreCase(String username);

    // Métodos para el Login
    Usuario findByEmail(String email);
    Usuario findByEmailAndPassword(String email, String password);
    
    // Opcional: Útil si quieres buscar por username O email en el login
    Optional<Usuario> findByUsernameOrEmail(String username, String email);
}