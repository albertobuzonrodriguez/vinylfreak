package backend.api.backend_api.controller;

import backend.api.backend_api.model.Usuario;
import backend.api.backend_api.repository.UsuarioRepository;
import backend.api.backend_api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario loginData) {
        Usuario usuario = usuarioService.validarLogin(loginData.getUsername(), loginData.getPassword());
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String nombre) {
        return ResponseEntity.ok(usuarioRepository.findByUsernameContainingIgnoreCase(nombre));
    }

    @PutMapping("/{id}/actualizar-perfil")
    public ResponseEntity<Usuario> actualizarPerfil(@PathVariable Long id, @RequestBody Usuario datos) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setBiografia(datos.getBiografia());
            usuario.setUrlFotoPerfil(datos.getUrlFotoPerfil());
            Usuario actualizado = usuarioRepository.save(usuario);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- NUEVO: MÉTODO PARA SEGUIR / DEJAR DE SEGUIR ---
    @PostMapping("/{username}/seguir")
    public ResponseEntity<?> toggleSeguir(@PathVariable String username, @RequestBody Map<String, String> body) {
        String seguidorUsername = body.get("seguidorUsername");
        
        Usuario aSeguir = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario a seguir no encontrado"));
        Usuario seguidor = usuarioRepository.findByUsername(seguidorUsername)
                .orElseThrow(() -> new RuntimeException("Tu usuario no fue encontrado"));

        if (seguidor.getSiguiendo().contains(aSeguir)) {
            seguidor.getSiguiendo().remove(aSeguir);
        } else {
            seguidor.getSiguiendo().add(aSeguir);
        }
        
        usuarioRepository.save(seguidor);
        return ResponseEntity.ok().build();
    }

    // --- NUEVO: COMPROBAR SI SIGUES A ALGUIEN ---
    @GetMapping("/{seguidor}/sigue-a/{seguido}")
    public ResponseEntity<Boolean> comprobarSiSigue(@PathVariable String seguidor, @PathVariable String seguido) {
        Usuario userSeguidor = usuarioRepository.findByUsername(seguidor).orElse(null);
        Usuario userSeguido = usuarioRepository.findByUsername(seguido).orElse(null);
        
        if (userSeguidor == null || userSeguido == null) return ResponseEntity.ok(false);
        
        return ResponseEntity.ok(userSeguidor.getSiguiendo().contains(userSeguido));
    }
}