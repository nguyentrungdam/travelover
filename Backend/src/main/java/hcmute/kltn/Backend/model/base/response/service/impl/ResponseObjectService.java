package hcmute.kltn.Backend.model.base.response.service.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;

@Service
public class ResponseObjectService implements IResponseObjectService{
	@Override
	public ResponseEntity<ResponseObject> success(ResponseObject responseObject) {
		ResponseObject responseObjectNew = new ResponseObject();
		responseObjectNew.setStatus("ok");
		responseObjectNew.setMessage(responseObject.getMessage() != null ? responseObject.getMessage() : "ok");
		responseObjectNew.setTotalPages(responseObject.getTotalPages() != 0 ? responseObject.getTotalPages() : 1);
		responseObjectNew.setCurrentpage(responseObject.getCurrentpage() != 0 ? responseObject.getCurrentpage() : 1);
		if(responseObject.getData() != null) {
			if(responseObject.getData() instanceof List<?>) {
				List<?> objectList = (List<?>) responseObject.getData();
				responseObjectNew.setCountData(objectList.size());
			} else {
				responseObjectNew.setCountData(1);
			}
		} else {
			responseObjectNew.setCountData(0);
		}
		responseObjectNew.setData(responseObject.getData() != null ? responseObject.getData() : "");
		
		return ResponseEntity.status(HttpStatus.OK).body(responseObjectNew);
	}

	@Override
	public ResponseEntity<ResponseObject> failed(ResponseObject responseObject) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseObject(
			"failed",
			responseObject.getMessage() != null ? responseObject.getMessage() : "failed",
			responseObject.getTotalPages() != 0 ? responseObject.getTotalPages() : 1,
			responseObject.getCurrentpage() != 0 ? responseObject.getCurrentpage() : 1,
			responseObject.getCountData() != 0 ? responseObject.getCountData() : 0,
			responseObject.getData() != null ? responseObject.getData() : ""
		));
	}
}
