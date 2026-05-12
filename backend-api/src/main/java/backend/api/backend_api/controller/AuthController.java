package backend.api.backend_api.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import backend.api.backend_api.dto.TokenDto;
import backend.api.backend_api.model.Usuario;
import backend.api.backend_api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin 
public class AuthController {

    @Value("${google.clientId}")
    private String googleClientId;

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/google")
    public ResponseEntity<?> google(@RequestBody TokenDto tokenDto) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(tokenDto.getTokenValue());

        if (idToken != null) {
            Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String nombre = (String) payload.get("name");
            String foto = (String) payload.get("picture");

            // ✅ Usamos el servicio de usuarios para la lógica de negocio
            Usuario usuario = usuarioService.obtenerOCrearUsuarioGoogle(email, nombre, foto);

            return ResponseEntity.ok(usuario);
        } else {
            // ✅ Es necesario retornar un error si el token es nulo
            return ResponseEntity.status(401).body("Token de Google inválido");
        }
    }
}