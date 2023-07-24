package hcmute.kltn.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hcmute.kltn.Backend.model.entity.GeneratorSequence;

public interface GeneratorSequenceRepository extends JpaRepository<GeneratorSequence, Long>{
	GeneratorSequence findByTableName(String tableName);
}
