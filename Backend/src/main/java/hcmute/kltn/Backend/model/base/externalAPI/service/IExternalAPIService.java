package hcmute.kltn.Backend.model.base.externalAPI.service;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;

public interface IExternalAPIService {
	public ResponseEntity<String> getCall(String url, HashMap<String, String> params);
}
