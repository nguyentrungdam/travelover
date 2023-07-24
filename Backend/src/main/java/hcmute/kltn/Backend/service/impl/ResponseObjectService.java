package hcmute.kltn.Backend.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;

@Service
public class ResponseObjectService implements IResponseObjectService{
	@Override
	public ResponseObject success(ResponseObject responseObject) {
		return new ResponseObject(
				"ok", 
				responseObject.getMessage() != null ? responseObject.getMessage() : "ok",
				responseObject.getTotalPages() != 0 ? responseObject.getTotalPages() : 1,
				responseObject.getCurrentpage() != 0 ? responseObject.getCurrentpage() : 1,
				responseObject.getCountData() != 0 ? responseObject.getCountData() : 1,
				responseObject.getData() != null ? responseObject.getData() : ""
		);
	}

	@Override
	public ResponseObject failed(ResponseObject responseObject) {
		return new ResponseObject(
				"failed", 
				responseObject.getMessage() != null ? responseObject.getMessage() : "ok",
				responseObject.getTotalPages() != 0 ? responseObject.getTotalPages() : 1,
				responseObject.getCurrentpage() != 0 ? responseObject.getCurrentpage() : 1,
				responseObject.getCountData() != 0 ? responseObject.getCountData() : 1,
				responseObject.getData() != null ? responseObject.getData() : ""
		);
	}
}
