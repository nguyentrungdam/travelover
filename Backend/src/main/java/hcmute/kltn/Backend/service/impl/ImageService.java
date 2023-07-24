package hcmute.kltn.Backend.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.service.intf.IImageService;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;

@Service
public class ImageService implements IImageService{
	@Autowired
	private Cloudinary cloudinary;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	private Logger logger = LoggerFactory.getLogger(ImageService.class);
	
	@Override
	public ResponseEntity<ResponseObject> createImage(MultipartFile file) {
		try {
    		Map params = ObjectUtils.asMap(
    				"folder", "Travelover",
    			    "use_filename", false,
    			    "unique_filename", true,
    			    "overwrite", false
    		);
    		Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
    		
    		Map<Object, Object> map = new HashMap<>();
    		map.put("public_id", result.get("public_id"));
    		map.put("url", result.get("url"));
    		
    		return ResponseEntity.status(HttpStatus.OK).body(
    				iResponseObjectService.success(new ResponseObject() {
						{
							setMessage("Upload image successfully");
							setData(result);
						}
					}));

    	} catch (Exception ex) {
    		logger.error("Error occurred: ", ex);
    		
    		return ResponseEntity.status(HttpStatus.OK).body(
    				iResponseObjectService.failed(new ResponseObject() {
						{
							setMessage("Failed to upload image");
							setData(ex.toString());
						}
					}));
    	}
	}

	@Override
	public ResponseEntity<ResponseObject> updateImage(String public_id, MultipartFile file) {
		try {
    		Map params = ObjectUtils.asMap(
    				"public_id", public_id,
    			    "use_filename", false,
    			    "unique_filename", true,
    			    "overwrite", true
    		);
    		Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
    		
    		Map<Object, Object> map = new HashMap<>();
    		map.put("public_id", result.get("public_id"));
    		map.put("url", result.get("url"));
    		
    		return ResponseEntity.status(HttpStatus.OK).body(
    				iResponseObjectService.success(new ResponseObject() {
						{
							setMessage("Update image successfully");
							setData(result);
						}
					}));

    	} catch (Exception ex) {
    		logger.error("Error occurred: ", ex);
    		
    		return ResponseEntity.status(HttpStatus.OK).body(
    				iResponseObjectService.failed(new ResponseObject() {
						{
							setMessage("Failed to update image");
							setData(ex.toString());
						}
					}));
    	}
	}

	@Override
	public ResponseEntity<ResponseObject> deleteImage(String public_id) {
		try {
    		Map<?, ?> result = cloudinary.uploader().destroy(public_id, ObjectUtils.emptyMap());
    		
    		return ResponseEntity.status(HttpStatus.OK).body(
    				iResponseObjectService.success(new ResponseObject() {
						{
							setMessage("Delete image successfully");
						}
					}));
    	} catch (Exception ex) {
    		logger.error("Error occurred: ", ex);
    		
    		return ResponseEntity.status(HttpStatus.OK).body(
    				iResponseObjectService.failed(new ResponseObject() {
						{
							setMessage("Failed to delete image");
							setData(ex.toString());
						}
					}));
    	}
	}
}
