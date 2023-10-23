package hcmute.kltn.Backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import hcmute.kltn.Backend.model.entity.GeneratorSequence;

public interface GeneratorSequenceRepository extends MongoRepository<GeneratorSequence, String>{
	GeneratorSequence findByCollectionName(String tableName);
	boolean existsByCollectionName(String tableName);
	boolean existsByPrefix(String prefix);
	List<GeneratorSequence> findAllByCollectionName(String tableName);
	List<GeneratorSequence> findAllByPrefix(String prefix);
}
