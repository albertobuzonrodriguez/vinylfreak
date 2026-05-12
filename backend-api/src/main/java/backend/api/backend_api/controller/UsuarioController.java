package backend.api.backend_api.controller;

import backend.api.backend_api.model.Usuario;
import backend.api.backend_api.repository.UsuarioRepository;
import backend.api.backend_api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.obtenerTodos();
    }

    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioService.guardarUsuario(usuario);
    }

    // --- MÉTODO ACTUALIZADO PARA EL LOGIN ---
    @PostMapping("/login") // Cambiado de Get a Post
    public ResponseEntity<Usuario> login(@RequestBody Usuario loginData) {
        // Asumo que tu objeto Usuario tiene campos 'username' o 'email' y 'password'
        // Usamos loginData.getUsername() o loginData.getEmail() según lo tengas
        Usuario usuario = usuarioService.validarLogin(loginData.getUsername(), loginData.getPassword());

        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String nombre) {
        // Esto asume que tienes un método findByUsernameContainingIgnoreCase en tu
        // Repository
        return ResponseEntity.ok(usuarioRepository.findByUsernameContainingIgnoreCase(nombre));
    }

    @PutMapping("/{id}/actualizar-perfil")
    public ResponseEntity<Usuario> actualizarPerfil(@PathVariable Long id, @RequestBody Usuario datos) {
        return usuarioRepository.findById(id).map(usuario -> {
            // Solo actualizamos lo que viene del panel de perfil
            usuario.setBiografia(datos.getBiografia());
            usuario.setUrlFotoPerfil(datos.getUrlFotoPerfil());

            Usuario actualizado = usuarioRepository.save(usuario);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }
}