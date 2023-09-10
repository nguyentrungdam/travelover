package hcmute.kltn.Backend.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.entity.GeneratorSequence;
import hcmute.kltn.Backend.repository.GeneratorSequenceRepository;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;

@Service
public class GeneratorSequenceService implements IGeneratorSequenceService {
	@Autowired
	private GeneratorSequenceRepository generatorSequenceRepository;
	@Autowired
	private ModelMapper modelMapper;

	@Override
	public GeneratorSequence create(GeneratorSequenceDTO generatorSequenceDTO) {
		// Check Already
		boolean existsTableName = generatorSequenceRepository.existsByTableName(generatorSequenceDTO.getTableName());
		if (existsTableName) {
			throw new CustomException("Table Name is already");
		} 

		boolean existsPrefix = generatorSequenceRepository.existsByPrefix(generatorSequenceDTO.getPrefix());
		if(existsPrefix) {
			throw new CustomException("Prefix is already");
		} 
		
		// Mapping
		GeneratorSequence generatorSequence = new GeneratorSequence();
		modelMapper.map(generatorSequenceDTO, generatorSequence);

		// Set default value
		generatorSequence.setNumber(0);
		
		generatorSequence = generatorSequenceRepository.save(generatorSequence);
		
		return generatorSequence;
	}

	@Override
	public GeneratorSequence update(GeneratorSequenceDTO generatorSequenceDTO) {
		// Check exists
		boolean exists = generatorSequenceRepository.existsById(generatorSequenceDTO.getId());
		if (!exists) {
			throw new CustomException("Cannot find generator sequence");
		}
		
		// Mapping
		GeneratorSequence generatorSequence = generatorSequenceRepository.findById(generatorSequenceDTO.getId()).get();
		modelMapper.map(generatorSequenceDTO, generatorSequence);
		
		// Check already
		List<GeneratorSequence> listByTableName = generatorSequenceRepository
				.findAllByTableName(generatorSequence.getTableName());
		for (GeneratorSequence item : listByTableName) {
			if (item.getTableName() == generatorSequence.getTableName() && item.getId() != generatorSequence.getId()) {
				throw new CustomException("Table name is already");
			}
		}
		
		List<GeneratorSequence> listByPrefix = generatorSequenceRepository
				.findAllByPrefix(generatorSequence.getPrefix());
		for (GeneratorSequence item : listByPrefix) {
			if (item.getPrefix() == generatorSequence.getPrefix() && item.getId() != generatorSequence.getId()) {
				throw new CustomException("Prefix is already");
			}
		}
		
		generatorSequence = generatorSequenceRepository.save(generatorSequence);
		
		return generatorSequence;
	}

	@Override
	public GeneratorSequence getDetail(long generatorSequenceId) {
		// Check exists
		boolean exists = generatorSequenceRepository.existsById(generatorSequenceId);
		if (!exists) {
			throw new CustomException("Cannot find generator sequence");
		}
		
		GeneratorSequence generatorSequence = generatorSequenceRepository.findById(generatorSequenceId).get();
		
		return generatorSequence;
		
	}

	@Override
	public List<GeneratorSequence> getAll() {
		List<GeneratorSequence> listGeneratorSequence = generatorSequenceRepository.findAll();

		return listGeneratorSequence;
		
	}

	@Override
	public boolean delete(long generatorSequenceId) {
		// Check exists
		boolean exists = generatorSequenceRepository.existsById(generatorSequenceId);
		if (!exists) {
			throw new CustomException("Cannot find generator sequence");
		} 
		
		generatorSequenceRepository.deleteById(generatorSequenceId);
		
		return true;
	}

	@Override
	public String genId(String tableName) {
		GeneratorSequence generatorSequence = generatorSequenceRepository.findByTableName(tableName);
		if (generatorSequence != null) {
			String id = generatorSequence.getPrefix() + String.format("%012d", generatorSequence.getNumber() + 1);
			generatorSequence.setNumber(generatorSequence.getNumber() + 1);
			generatorSequenceRepository.save(generatorSequence);
			return id;
		} else {
			return null;
		}
	}

	@Override
	public boolean initData(GeneratorSequenceDTO generatorSequenceDTO) {
		// Check Already
		boolean existsTableName = generatorSequenceRepository.existsByTableName(generatorSequenceDTO.getTableName());
		boolean existsPrefix = generatorSequenceRepository.existsByPrefix(generatorSequenceDTO.getPrefix());
		if(existsTableName || existsPrefix) {
			return false;
		}
		
		// Mapping
		GeneratorSequence generatorSequence = new GeneratorSequence();
		modelMapper.map(generatorSequenceDTO, generatorSequence);

		// Set default value
		generatorSequence.setNumber(0);
		
		generatorSequence = generatorSequenceRepository.save(generatorSequence);
		
		return true;
	}

}
