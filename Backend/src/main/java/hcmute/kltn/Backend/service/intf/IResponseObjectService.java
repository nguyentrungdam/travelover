package hcmute.kltn.Backend.service.intf;

import hcmute.kltn.Backend.model.dto.ResponseObject;

public interface IResponseObjectService {
	public ResponseObject success(ResponseObject responseObject);
	public ResponseObject failed(ResponseObject responseObject);
}
