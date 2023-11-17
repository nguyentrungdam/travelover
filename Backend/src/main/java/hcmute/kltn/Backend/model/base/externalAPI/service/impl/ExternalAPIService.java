package hcmute.kltn.Backend.model.base.externalAPI.service.impl;

import java.util.HashMap;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import hcmute.kltn.Backend.model.base.externalAPI.service.IExternalAPIService;

@Service
public class ExternalAPIService implements IExternalAPIService{
	
	private final RestTemplate restTemplate;
	
	@Autowired
	public ExternalAPIService(RestTemplateBuilder restTemplateBuilder) {
		this.restTemplate = restTemplateBuilder.build();
	}

	@Override
	public ResponseEntity<String> getCall(String url, HashMap<String, String> params) {
//		HttpHeaders headers = new HttpHeaders();
//		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//		
//		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
		for (String key : params.keySet()) {
			String value = params.get(key);
			builder.queryParam(key, value);
		}
		
		ResponseEntity<String> response = restTemplate.getForEntity(builder.toUriString(), String .class);
		
		return response;
	}

}
