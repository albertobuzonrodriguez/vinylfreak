package backend.api.backend_api.service;

import backend.api.backend_api.model.ColeccionItem;
import backend.api.backend_api.model.Vinilo;
import backend.api.backend_api.model.Usuario;
import backend.api.backend_api.repository.ColeccionRepository;
import backend.api.backend_api.repository.ViniloRepository;
import backend.api.backend_api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ColeccionService {

    @Autowired
    private ColeccionRepository coleccionRepository;

    @Autowired
    private ViniloRepository viniloRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public ColeccionItem agregarDesdeDiscogs(Vinilo viniloData, Long usuarioId, String estado) {
        // 1. Verificar si el vinilo ya existe en nuestro catálogo maestro por su ID de Discogs
        // Esto evita duplicar "Random Access Memories" cada vez que alguien lo añade
        Vinilo viniloMaster = viniloRepository.findByDiscogsId(viniloData.getDiscogsId())
                .orElseGet(() -> viniloRepository.save(viniloData));

        // 2. Recuperar el usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 3. Crear el nuevo ítem de la colección vinculado al usuario y al vinilo maestro
        ColeccionItem nuevoItem = new ColeccionItem();
        nuevoItem.setUsuario(usuario);
        nuevoItem.setVinilo(viniloMaster);
        nuevoItem.setEstadoDisco(estado);
        nuevoItem.setEstadoPortada(estado); // Podemos inicializar ambos igual
        nuevoItem.setEnVenta(false);
        
        // Aplicamos tu lógica de tasación si es necesario
        if ("Mint".equalsIgnoreCase(estado)) {
            // Aquí puedes definir un precio base o lógica de tasación
            nuevoItem.setPrecioTasado(50.0 * 1.2); 
        }

        return coleccionRepository.save(nuevoItem);
    }

    public List<ColeccionItem> obtenerBibliotecaUsuario(Long usuarioId) {
        return coleccionRepository.findByUsuarioId(usuarioId);
    }

    // Tu método original adaptado
    public ColeccionItem agregarAVitrina(ColeccionItem item) {
        if ("Mint".equals(item.getEstadoDisco())) {
            item.setPrecioTasado(item.getPrecioTasado() * 1.2);
        }
        return coleccionRepository.save(item);
    }

    public void eliminarPorId(Long id) {
        // Usamos el método nativo de JpaRepository
        coleccionRepository.deleteById(id);
    }
}