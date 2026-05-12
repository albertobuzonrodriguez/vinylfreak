package backend.api.backend_api.service;

import backend.api.backend_api.model.Usuario;
import backend.api.backend_api.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    // CREATE: Guardar un nuevo usuario
    public Usuario guardarUsuario(Usuario usuario) {
        // Encriptamos la contraseña antes de guardar en la base de datos
        String encodedPassword = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(encodedPassword);
        return usuarioRepository.save(usuario);
    }

    // READ: Obtener todos los usuarios
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // UPDATE: Actualizar datos (ej: cambiar email)
    public Usuario actualizarUsuario(Long id, Usuario detallesUsuario) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();
        usuario.setEmail(detallesUsuario.getEmail());
        usuario.setUsername(detallesUsuario.getUsername());
        return usuarioRepository.save(usuario);
    }

    // DELETE: Borrar usuario
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario validarLogin(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email); // Solo por email

        if (usuario != null) {
            // BCrypt comparará la contraseña en texto plano con el hash de la BD
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                return usuario;
            }
        }
        return null;
    }

    // Dentro de UsuarioService.java, añade este método al final:

    @Transactional
    public Usuario obtenerOCrearUsuarioGoogle(String email, String nombre, String foto) {
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario != null) {
            return usuario; // Ya existe, lo devolvemos
        } else {
            // No existe, lo creamos
            Usuario nuevo = new Usuario();
            nuevo.setEmail(email);
            nuevo.setUsername(nombre);
            nuevo.setUrlFotoPerfil(foto);
            // Password aleatorio para cumplir con la seguridad
            nuevo.setPassword(passwordEncoder.encode("OAUTH2_" + Math.random()));
            return usuarioRepository.save(nuevo);
        }
    }
}