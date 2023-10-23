package hcmute.kltn.Backend.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.dto.TestMongoDBDTO;
import hcmute.kltn.Backend.model.entity.TestMongoDB;
import hcmute.kltn.Backend.repository.TestMongoDBRepository;
import hcmute.kltn.Backend.service.intf.ITestMongoDBService;

@Service
public class TestMongoDBService implements ITestMongoDBService{
	@Autowired
	private TestMongoDBRepository testMongoDBRepository;
	@Autowired
	private ModelMapper modelMapper;

	@Override
	public TestMongoDB create(TestMongoDBDTO testMongoDBDTO) {
		fieldConditions(testMongoDBDTO);
		
		// Mapping
		TestMongoDB testMongoDB = new TestMongoDB();
		modelMapper.map(testMongoDBDTO, testMongoDB);
				
		return testMongoDBRepository.save(testMongoDB);
	}

	@Override
	public List<TestMongoDB> getAll() {
		return testMongoDBRepository.findAll();
	}

	private void fieldConditions(TestMongoDBDTO testMongoDBDTO) {
		// Check unique
		if (testMongoDBRepository.existsByTableName(testMongoDBDTO.getTableName())) {
			throw new CustomException("Table Name is already");
		}
		
		if (testMongoDBRepository.existsByPrefix(testMongoDBDTO.getPrefix())) {
			throw new CustomException("Prefix is already");
		}
		
		// Check not null
	}

	@Override
	public boolean initData(TestMongoDBDTO testMongoDBDTO) {
		// Check unique
		if (testMongoDBRepository.existsByTableName(testMongoDBDTO.getTableName())
				|| testMongoDBRepository.existsByPrefix(testMongoDBDTO.getPrefix())) {
			return false;
		}
		
		// Check not null
		
		// Mapping
		TestMongoDB testMongoDB = new TestMongoDB();
		modelMapper.map(testMongoDBDTO, testMongoDB);
		
		testMongoDBRepository.save(testMongoDB);
		return true;
	}
}
