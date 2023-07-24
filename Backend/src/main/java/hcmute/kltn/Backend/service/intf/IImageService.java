package hcmute.kltn.Backend.service.intf;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.dto.ResponseObject;

public interface IImageService {
	public ResponseEntity<ResponseObject> createImage(MultipartFile file);
	public ResponseEntity<ResponseObject> updateImage(String public_id, MultipartFile file);
	public ResponseEntity<ResponseObject> deleteImage(String public_id);
}
