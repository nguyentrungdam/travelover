package hcmute.kltn.Backend.service.intf;

import org.springframework.http.ResponseEntity;

import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.model.entity.GeneratorSequence;

public interface IGeneratorSequenceService {
	public ResponseEntity<ResponseObject> createGeneratorSequence(GeneratorSequence newGeneratorSequence);
	public ResponseEntity<ResponseObject> updateGeneratorSequence(long id, GeneratorSequence newGeneratorSequence);
	public ResponseEntity<ResponseObject> getDetailGeneratorSequence(long id);
	public ResponseEntity<ResponseObject> getAllGeneratorSequence();
	public ResponseEntity<ResponseObject> deleteGeneratorSequence(long id);
	public String genID(String tableName);
}
