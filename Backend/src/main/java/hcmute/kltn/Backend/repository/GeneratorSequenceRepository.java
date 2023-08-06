package hcmute.kltn.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hcmute.kltn.Backend.model.entity.GeneratorSequence;

public interface GeneratorSequenceRepository extends JpaRepository<GeneratorSequence, Long>{
	GeneratorSequence findByTableName(String tableName);
	boolean existsByTableName(String tableName);
	boolean existsByPrefix(String prefix);
	List<GeneratorSequence> findAllByTableName(String tableName);
	List<GeneratorSequence> findAllByPrefix(String prefix);
}
