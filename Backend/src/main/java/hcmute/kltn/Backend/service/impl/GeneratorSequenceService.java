package hcmute.kltn.Backend.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.model.entity.GeneratorSequence;
import hcmute.kltn.Backend.repository.GeneratorSequenceRepository;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;

@Service
public class GeneratorSequenceService implements IGeneratorSequenceService {
	@Autowired
	private GeneratorSequenceRepository generatorSequenceRepository;
	@Autowired
	private IResponseObjectService iResponseObjectService;

	@Override
	public ResponseEntity<ResponseObject> createGeneratorSequence(GeneratorSequence newGeneratorSequence) {
		GeneratorSequence generatorSequence = generatorSequenceRepository
				.findByTableName(newGeneratorSequence.getTableName().trim());
		if (generatorSequence != null) {
			return ResponseEntity.status(HttpStatus.OK)
					.body(iResponseObjectService.failed(new ResponseObject() {
						{
							setMessage("Generator Sequence is already");
						}
					}));
		} else {
			newGeneratorSequence.setNumber(0);
			return ResponseEntity.status(HttpStatus.OK)
					.body(iResponseObjectService.success(new ResponseObject() {
						{
							setMessage("Create Generator Sequence successfully");
							setData(generatorSequenceRepository.save(newGeneratorSequence));
						}
					}));
		}
	}

	@Override
	public ResponseEntity<ResponseObject> updateGeneratorSequence(long id, GeneratorSequence newGeneratorSequence) {
		GeneratorSequence generatorSequence = generatorSequenceRepository.findById(id).map(item -> {
			item.setTableName(newGeneratorSequence.getTableName());
			item.setPrefix(newGeneratorSequence.getPrefix());
			item.setNumber(newGeneratorSequence.getNumber());
			item.setDescription(newGeneratorSequence.getDescription());
			return generatorSequenceRepository.save(item);
		}).orElseGet(() -> {
			return generatorSequenceRepository.save(newGeneratorSequence);
		});

		return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService
				.success(new ResponseObject() {
					{
						setMessage("Update Generator Sequence successfully");
						setData(newGeneratorSequence);
					}
				}));
	}

	@Override
	public ResponseEntity<ResponseObject> getDetailGeneratorSequence(long id) {
		Optional<GeneratorSequence> generatorSequence = generatorSequenceRepository.findById(id);
		return generatorSequence.isPresent() ? ResponseEntity.status(HttpStatus.OK).body(
				iResponseObjectService.success(new ResponseObject() {
					{
						setMessage("Query Generator Sequence successfully");
						setData(generatorSequence);
					}
				}))
				// you can replace "ok" with your defined "error code"
				: ResponseEntity.status(HttpStatus.NOT_FOUND).body(
						iResponseObjectService.failed(new ResponseObject() {
							{
								setMessage("Cannot find Generator Sequence with id = " + id);
							}
						}));
	}

	@Override
	public ResponseEntity<ResponseObject> getAllGeneratorSequence() {
		List<GeneratorSequence> listGeneratorSequence = generatorSequenceRepository.findAll();

		return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Get all Generator Sequence");
				setCountData(listGeneratorSequence.size());
				setData(listGeneratorSequence);
			}
		}));
	}

	@Override
	public ResponseEntity<ResponseObject> deleteGeneratorSequence(long id) {
		boolean exists = generatorSequenceRepository.existsById(id);
		if (exists) {
			generatorSequenceRepository.deleteById(id);
			return ResponseEntity.status(HttpStatus.OK)
					.body(iResponseObjectService.success(new ResponseObject() {
						{
							setMessage("Delete Generator Sequence successfully");
						}
					}));
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(iResponseObjectService.failed(new ResponseObject() {
						{
							setMessage("Cannot find Generator Sequence to delete");
						}
					}));
		}
	}

	@Override
	public String genID(String tableName) {
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

}
