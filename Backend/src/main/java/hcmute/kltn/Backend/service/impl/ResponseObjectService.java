package hcmute.kltn.Backend.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.model.ResponseObject;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;

@Service
public class ResponseObjectService implements IResponseObjectService{
	@Override
	public ResponseEntity<ResponseObject> success(ResponseObject responseObject) {
		return ResponseEntity.status(HttpStatus.OK).body(new ResponseObject(
				"ok", 
				responseObject.getMessage() != null ? responseObject.getMessage() : "ok",
				responseObject.getTotalPages() != 0 ? responseObject.getTotalPages() : 1,
				responseObject.getCurrentpage() != 0 ? responseObject.getCurrentpage() : 1,
				responseObject.getCountData() != 0 ? responseObject.getCountData() : 1,
				responseObject.getData() != null ? responseObject.getData() : ""
		));
	}

	@Override
	public ResponseEntity<ResponseObject> failed(ResponseObject responseObject) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseObject(
			"failed",
			responseObject.getMessage() != null ? responseObject.getMessage() : "ok",
			responseObject.getTotalPages() != 0 ? responseObject.getTotalPages() : 1,
			responseObject.getCurrentpage() != 0 ? responseObject.getCurrentpage() : 1,
			responseObject.getCountData() != 0 ? responseObject.getCountData() : 1,
			responseObject.getData() != null ? responseObject.getData() : ""
			
		));
	}
}
