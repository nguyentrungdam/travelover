package hcmute.kltn.Backend.model.generatorSequence.service.impl;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceCreate;
import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.generatorSequence.dto.entity.GeneratorSequence;
import hcmute.kltn.Backend.model.generatorSequence.repository.GeneratorSequenceRepository;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;

@Service
public class GeneratorSequenceService implements IGeneratorSequenceService {
	@Autowired
	private GeneratorSequenceRepository generatorSequenceRepository;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
    private MongoTemplate mongoTemplate;
	
	private void checkFieldCondition(GeneratorSequenceDTO generatorSequenceDTO) {
		// check null
		if(generatorSequenceDTO.getCollectionName() == null || generatorSequenceDTO.getCollectionName().equals("")) {
			throw new CustomException("Collection Name is not null");
		}
		if(generatorSequenceDTO.getPrefix() == null || generatorSequenceDTO.getPrefix().equals("")) {
			throw new CustomException("Prefix is not null");
		}
//		if(generatorSequenceDTO.getNumber() < 0) {
//			throw new CustomException("Number must be greater than or equal to 0");
//		}
		
		// check unique
		if(generatorSequenceDTO.getId() == null || generatorSequenceDTO.getId().equals("")) {
			if(generatorSequenceRepository.existsByCollectionName(generatorSequenceDTO.getCollectionName())) {
				throw new CustomException("Collection Name is already");
			}
			if(generatorSequenceRepository.existsByPrefix(generatorSequenceDTO.getPrefix())) {
				throw new CustomException("Prefix is already");
			}
		} else {
			GeneratorSequence generatorSequence = generatorSequenceRepository.findById(generatorSequenceDTO.getId()).get();
			List<GeneratorSequence> generatorSequencesCltNList = generatorSequenceRepository.findAllByCollectionName(generatorSequenceDTO.getCollectionName());
			for(GeneratorSequence item : generatorSequencesCltNList) {
				if(item.getCollectionName() == generatorSequence.getCollectionName() && item.getId() != generatorSequence.getId()) {
					throw new CustomException("Collection Name is already");
				}
			}

			List<GeneratorSequence> generatorSequencesPrfNList = generatorSequenceRepository.findAllByPrefix(generatorSequenceDTO.getPrefix());
			for(GeneratorSequence item : generatorSequencesPrfNList) {
				if(item.getPrefix() == generatorSequence.getPrefix() && item.getId() != generatorSequence.getId()) {
					throw new CustomException("Prefix is already");
				}
			}
		}
	}

	private GeneratorSequence create(GeneratorSequenceDTO generatorSequenceDTO) {
		// check field condition
		checkFieldCondition(generatorSequenceDTO);
		
		// Mapping
		GeneratorSequence generatorSequence = new GeneratorSequence();
		modelMapper.map(generatorSequenceDTO, generatorSequence);

		// Set default value
		generatorSequence.setNumber(0);
		
		// create generator sequence
		generatorSequence = generatorSequenceRepository.save(generatorSequence);
		
		return generatorSequence;
	}

	private GeneratorSequence update(GeneratorSequenceDTO generatorSequenceDTO) {
		// Check exists
		if (!generatorSequenceRepository.existsById(generatorSequenceDTO.getId())) {
			throw new CustomException("Cannot find generator sequence");
		}
		
		// check field condition
		checkFieldCondition(generatorSequenceDTO);
		
		// get GeneratorSequence from db
		GeneratorSequence generatorSequence = generatorSequenceRepository.findById(generatorSequenceDTO.getId()).get();
		
		// Mapping
		modelMapper.map(generatorSequenceDTO, generatorSequence);
		
		// set default value
		
		// update
		generatorSequence = generatorSequenceRepository.save(generatorSequence);
		
		return generatorSequence;
	}

	private GeneratorSequence getDetail(String generatorSequenceId) {
		// Check exists
		if (!generatorSequenceRepository.existsById(generatorSequenceId)) {
			throw new CustomException("Cannot find generator sequence");
		}
		
		// get GeneratorSequence from db
		GeneratorSequence generatorSequence = generatorSequenceRepository.findById(generatorSequenceId).get();
		
		return generatorSequence;
	}

	private List<GeneratorSequence> getAll() {
		// get all GeneratorSequence from db
		List<GeneratorSequence> listGeneratorSequence = generatorSequenceRepository.findAll();

		return listGeneratorSequence;
		
	}

	private boolean delete(String generatorSequenceId) {
		// Check exists
		if (!generatorSequenceRepository.existsById(generatorSequenceId)) {
			throw new CustomException("Cannot find generator sequence");
		} 
		
		// delete generatorSequence
		generatorSequenceRepository.deleteById(generatorSequenceId);
		
		return true;
	}
	
	private List<GeneratorSequence> search(String keyword) {
		// init generatorSequence List
		List<GeneratorSequence> genSeqList = new ArrayList<>();
		
		if(keyword == null || keyword.equals("")) {
			genSeqList = getAll();
		} else {
			// create list field name
			List<Criteria> criteriaList = new ArrayList<>();
			for(Field itemField : GeneratorSequence.class.getDeclaredFields()) {
				if(itemField.getType() == String.class) {
					criteriaList.add(Criteria.where(itemField.getName()).regex(keyword, "i"));
				}
			}
			Criteria criteria = new Criteria();
			criteria.orOperator(criteriaList.toArray(new Criteria[0]));
			
			// create query
			Query query = new Query();
			query.addCriteria(criteria);
			
			// search
			genSeqList = mongoTemplate.find(query, GeneratorSequence.class);
		}
		
		return genSeqList;
	}

	@Override
	public GeneratorSequence createGenSeq(GeneratorSequenceCreate generatorSequenceCreate) {
		// mapping
		GeneratorSequenceDTO generatorSequenceDTO = new GeneratorSequenceDTO();
		modelMapper.map(generatorSequenceCreate, generatorSequenceDTO);
		
		// create generatorSequence
		GeneratorSequence generatorSequence = create(generatorSequenceDTO);
		
		return generatorSequence;
	}

	@Override
	public GeneratorSequence updateGenSeq(GeneratorSequenceDTO generatorSequenceDTO) {
		GeneratorSequence genSeq = update(generatorSequenceDTO);
		
		return genSeq;
	}

	@Override
	public GeneratorSequence getDetailGenSeq(String id) {
		GeneratorSequence genSeq = getDetail(id);

		return genSeq;
	}

	@Override
	public List<GeneratorSequence> getAllGenSeq() {
		List<GeneratorSequence> genSeqList = getAll();

		return genSeqList;
	}

	@Override
	public List<GeneratorSequence> searchGenSeq(String keyword) {
		List<GeneratorSequence> genSeqList = search(keyword);
		
		return genSeqList;
	}
	
	@Override
	public String genId(String collectionName) {
		GeneratorSequence generatorSequence = generatorSequenceRepository.findByCollectionName(collectionName);
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
		boolean existsTableName = generatorSequenceRepository.existsByCollectionName(generatorSequenceDTO.getCollectionName());
		boolean existsPrefix = generatorSequenceRepository.existsByPrefix(generatorSequenceDTO.getPrefix());
		if(existsTableName || existsPrefix) {
			return false;
		}
		
		// Mapping
		GeneratorSequence generatorSequence = new GeneratorSequence();
		modelMapper.map(generatorSequenceDTO, generatorSequence);

		// Set default value
		
		generatorSequence = generatorSequenceRepository.save(generatorSequence);
		
		return true;
	}
}
