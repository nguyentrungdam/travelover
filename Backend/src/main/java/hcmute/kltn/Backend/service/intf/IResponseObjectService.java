package hcmute.kltn.Backend.service.intf;

import org.springframework.http.ResponseEntity;

import hcmute.kltn.Backend.model.ResponseObject;

public interface IResponseObjectService {
	public ResponseEntity<ResponseObject> success(ResponseObject responseObject);
	public ResponseEntity<ResponseObject> failed(ResponseObject responseObject);
}
