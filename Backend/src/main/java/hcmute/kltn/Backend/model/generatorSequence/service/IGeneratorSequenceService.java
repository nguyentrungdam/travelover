package hcmute.kltn.Backend.model.generatorSequence.service;

import java.util.List;

import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceCreate;
import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.generatorSequence.dto.entity.GeneratorSequence;

public interface IGeneratorSequenceService {
	public GeneratorSequence createGenSeq(GeneratorSequenceCreate generatorSequenceCreate);
	public GeneratorSequence updateGenSeq(GeneratorSequenceDTO generatorSequenceDTO);
	public GeneratorSequence getDetailGenSeq(String id);
	public List<GeneratorSequence> getAllGenSeq();
	public List<GeneratorSequence> searchGenSeq(String keyword);
	
	public String genId(String collectionName);
	public boolean initData(GeneratorSequenceDTO generatorSequenceDTO);
	
}
