package hcmute.kltn.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceCreate;
import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.generatorSequence.dto.entity.GeneratorSequence;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/generator-sequences")
@Tag(name = "Generator Sequence", description = "APIs for managing Generator Sequence - FOR DEV")
@SecurityRequirement(name = "Bearer Authentication")
public class GeneratorSequenceController {
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
    @Operation(summary = "Get all Generator Sequence - ADMIN")
	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
    ResponseEntity<ResponseObject> getAllPrefixId() {
        List<GeneratorSequence> generatorSequenceList = iGeneratorSequenceService.getAll();
        
        return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Get all Generator Sequence");
				setCountData(generatorSequenceList.size());
				setData(generatorSequenceList);
			}
		});
    }
    
    @RequestMapping(value = "/detail/{id}", method = RequestMethod.GET)
    @Operation(summary = "Get detail Generator Sequence - ADMIN")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    ResponseEntity<ResponseObject> findById(@PathVariable String id) {
    	GeneratorSequence generatorSequence = iGeneratorSequenceService.getDetail(id);
    	
    	return iResponseObjectService.success(new ResponseObject() {
					{
						setMessage("Get detail Generator Sequence successfully");
						setData(generatorSequence);
					}
				});
    }
    
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @Operation(summary = "Create Generator Sequence - ADMIN")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    ResponseEntity<ResponseObject> createPrefixId(@RequestBody GeneratorSequenceCreate generatorSequenceCreate) {
    	GeneratorSequence generatorSequence = iGeneratorSequenceService.createGenSeq(generatorSequenceCreate);
        
        return iResponseObjectService.success(new ResponseObject() {
					{
						setMessage("Create Generator Sequence successfully");
						setData(generatorSequence);
					}
				});
    }
    
    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    @Operation(summary = "Update Generator Sequence - ADMIN")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    ResponseEntity<ResponseObject> updateProduct(@PathVariable long generatorSequenceId, @RequestBody GeneratorSequenceDTO generatorSequenceDTO) {
    	GeneratorSequence generatorSequence = iGeneratorSequenceService.update(generatorSequenceDTO);
    	
    	return iResponseObjectService
				.success(new ResponseObject() {
					{
						setMessage("Update Generator Sequence successfully");
						setData(generatorSequence);
					}
				});
    }
    
//    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
//    @Operation(summary = "Delete Generator Sequence")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    ResponseEntity<ResponseObject> deleteProduct(@PathVariable long id) {
//    	boolean delete = iGeneratorSequenceService.delete(id);
//    	
//    	return iResponseObjectService.success(new ResponseObject() {
//					{
//						setMessage("Delete Generator Sequence successfully");
//					}
//				});
//    }
}
