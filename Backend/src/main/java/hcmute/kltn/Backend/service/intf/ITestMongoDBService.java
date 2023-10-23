package hcmute.kltn.Backend.service.intf;

import java.util.List;

import hcmute.kltn.Backend.model.dto.TestMongoDBDTO;
import hcmute.kltn.Backend.model.entity.TestMongoDB;

public interface ITestMongoDBService {
	public boolean initData(TestMongoDBDTO testMongoDBDTO);
	public TestMongoDB create(TestMongoDBDTO testMongoDBDTO);
	public List<TestMongoDB> getAll();
}
