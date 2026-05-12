package backend.api.backend_api.service;

import backend.api.backend_api.model.Vinilo;
import backend.api.backend_api.repository.ViniloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ViniloService {

    @Autowired
    private ViniloRepository viniloRepository;

    public Vinilo guardarVinilo(Vinilo vinilo) {
        return viniloRepository.save(vinilo);
    }

    public List<Vinilo> obtenerTodos() {
        return viniloRepository.findAll();
    }

    public Optional<Vinilo> obtenerPorDiscogsId(Long discogsId) {
        return viniloRepository.findByDiscogsId(discogsId);
    }
    
}