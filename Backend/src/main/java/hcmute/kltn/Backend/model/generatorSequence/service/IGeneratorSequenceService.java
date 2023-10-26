package hcmute.kltn.Backend.model.generatorSequence.service;

import java.util.List;

import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceCreate;
import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.generatorSequence.dto.entity.GeneratorSequence;

public interface IGeneratorSequenceService {
	public GeneratorSequence create(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence update(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence getDetail(String generatorSequenceId);
	public List<GeneratorSequence> getAll();
	public boolean delete(String generatorSequenceId);
	
	public String genId(String collectionName);
	public boolean initData(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence createGenSeq(GeneratorSequenceCreate generatorSequenceCreate);
}
