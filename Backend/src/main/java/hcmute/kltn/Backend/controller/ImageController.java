package hcmute.kltn.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.service.intf.IImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/images")
@Tag(name = "Images", description = "APIs for managing images")
@SecurityRequirement(name = "Bearer Authentication")
public class ImageController {
	@Autowired
    private IImageService iImageService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image")
    ResponseEntity<ResponseObject> createImage(@RequestParam("file") MultipartFile file) {
    	return iImageService.createImage(file);
    }
    
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update image")
    ResponseEntity<ResponseObject> updateImage(
    		@RequestParam("public_id") String public_id,
    		@RequestParam("file") MultipartFile file) {
    	return iImageService.updateImage(public_id, file);
    }
    
    @DeleteMapping(value = "/delete{public_id}")
    @Operation(summary = "Delete image")
    ResponseEntity<ResponseObject> deleteImage(@RequestParam("public_id") String public_id) {
    	return iImageService.deleteImage(public_id);
    }
    

}
