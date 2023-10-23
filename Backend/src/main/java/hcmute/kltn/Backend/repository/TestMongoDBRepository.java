package hcmute.kltn.Backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import hcmute.kltn.Backend.model.entity.TestMongoDB;

public interface TestMongoDBRepository extends MongoRepository<TestMongoDB, String>{
	boolean existsByTableName(String tableName);
	boolean existsByPrefix(String prefix);
}
