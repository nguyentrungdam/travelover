package hcmute.kltn.Backend.model.base.response.service;

import org.springframework.http.ResponseEntity;

import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;

public interface IResponseObjectService {
	public ResponseEntity<ResponseObject> success(ResponseObject responseObject);
	public ResponseEntity<ResponseObject> failed(ResponseObject responseObject);
}
