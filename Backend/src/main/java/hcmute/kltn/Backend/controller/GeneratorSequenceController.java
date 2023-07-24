package hcmute.kltn.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.model.entity.GeneratorSequence;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/generatorsequence")
@Tag(name = "Generator Sequence", description = "APIs for managing Generator Sequence")
@SecurityRequirement(name = "Bearer Authentication")
public class GeneratorSequenceController {
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	
	@GetMapping("/list")
    @Operation(summary = "Get all Generator Sequence")
    ResponseEntity<ResponseObject> getAllPrefixId() {
        return iGeneratorSequenceService.getAllGeneratorSequence();
    }
    
    @GetMapping("/generatorsequence/{id}")
    @Operation(summary = "Get detail Generator Sequence")
    ResponseEntity<ResponseObject> findById(@PathVariable long id) {
    	return iGeneratorSequenceService.getDetailGeneratorSequence(id);
    }
    
    @PostMapping("/create")
    @Operation(summary = "insert new Generator Sequence with POST method")
    ResponseEntity<ResponseObject> createPrefixId(@RequestBody GeneratorSequence newGeneratorSequence) {
        return iGeneratorSequenceService.createGeneratorSequence(newGeneratorSequence);
    }
    
    @PutMapping("/update/{id}")
    @Operation(summary = "Update Generator Sequence")
    ResponseEntity<ResponseObject> updateProduct(@PathVariable long id, @RequestBody GeneratorSequence newGeneratorSequence) {
    	return iGeneratorSequenceService.updateGeneratorSequence(id, newGeneratorSequence);
    }
    
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete Generator Sequence")
    ResponseEntity<ResponseObject> deleteProduct(@PathVariable long id) {
    	return iGeneratorSequenceService.deleteGeneratorSequence(id);
    }
}
