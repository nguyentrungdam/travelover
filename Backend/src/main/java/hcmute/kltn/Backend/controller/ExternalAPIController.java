package hcmute.kltn.Backend.controller;

import java.util.HashMap;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.base.externalAPI.service.IExternalAPIService;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.util.HashMapUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/external-api")
@Tag(name = "External API", description = "APIs for managing external API")
@SecurityRequirement(name = "Bearer Authentication")
public class ExternalAPIController {
	@Autowired
	private IExternalAPIService iExternalAPIService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	@RequestMapping(value = "/get", method = RequestMethod.GET)
	@Operation(summary = "Get external api")
	ResponseEntity<ResponseObject> get(@RequestParam String url, @RequestParam HashMap<String, String> params) {
		ResponseEntity<String> response;
		
		try {
			response = iExternalAPIService.getCall(url, params);
		} catch(Exception e) {
			String message = e.getMessage();
			String[] messageSplit = message.split("\"", 2);
			if (messageSplit.length == 1) {
				throw new CustomException("There was an error during the API call");
			}
			JSONObject jsonObject = new JSONObject(messageSplit[1]);
			throw new CustomException(jsonObject.getString("message"));
		}
		
		JSONObject jsonObject = new JSONObject(response.getBody());
		System.out.println("body = " + response.getBody());

		HashMap<Object, Object> map = HashMapUtil.stringToHashMap(jsonObject.toString());
		System.out.println("map = " + map);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage(jsonObject.getString("message"));
				setData(map);
			}
		});
	}
}
