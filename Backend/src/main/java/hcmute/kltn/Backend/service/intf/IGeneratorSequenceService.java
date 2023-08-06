package hcmute.kltn.Backend.service.intf;

import java.util.List;

import org.springframework.http.ResponseEntity;

import hcmute.kltn.Backend.model.ResponseObject;
import hcmute.kltn.Backend.model.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.entity.GeneratorSequence;

public interface IGeneratorSequenceService {
	public GeneratorSequence create(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence update(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence getDetail(long generatorSequenceId);
	public List<GeneratorSequence> getAll();
	public boolean delete(long generatorSequenceId);
	
	public String genId(String tableName);
}
