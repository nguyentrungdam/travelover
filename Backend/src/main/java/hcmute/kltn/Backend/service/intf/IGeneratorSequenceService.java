package hcmute.kltn.Backend.service.intf;

import java.util.List;

import hcmute.kltn.Backend.model.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.entity.GeneratorSequence;

public interface IGeneratorSequenceService {
	public GeneratorSequence create(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence update(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence getDetail(String generatorSequenceId);
	public List<GeneratorSequence> getAll();
	public boolean delete(String generatorSequenceId);
	
	public String genId(String tableName);
	public boolean initData(GeneratorSequenceDTO generatorSequenceDTO);
}
