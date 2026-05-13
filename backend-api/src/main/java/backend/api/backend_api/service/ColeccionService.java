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
        // 1. Recuperar el usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Buscar o crear el vinilo en el catálogo maestro
        Vinilo viniloMaster = viniloRepository.findByDiscogsId(viniloData.getDiscogsId())
                .orElseGet(() -> {
                    viniloData.setId(null); // Aseguramos que sea una inserción limpia
                    return viniloRepository.save(viniloData);
                });

        // 3. Crear el ítem para la biblioteca del usuario
        ColeccionItem nuevoItem = new ColeccionItem();
        nuevoItem.setUsuario(usuario);
        nuevoItem.setVinilo(viniloMaster);
        nuevoItem.setEstadoDisco(estado);
        nuevoItem.setEstadoPortada(estado);
        nuevoItem.setPrecioTasado(20.0); // Valor por defecto
        nuevoItem.setEnVenta(false);

        return coleccionRepository.save(nuevoItem);
    }

    public List<ColeccionItem> obtenerBibliotecaUsuario(Long usuarioId) {
        List<ColeccionItem> items = coleccionRepository.findByUsuarioId(usuarioId);
        // Limpiamos nulos por seguridad antes de enviar a Angular
        items.removeIf(item -> item == null || item.getVinilo() == null);
        return items;
    }

    public void eliminarPorId(Long id) {
        coleccionRepository.deleteById(id);
    }
}