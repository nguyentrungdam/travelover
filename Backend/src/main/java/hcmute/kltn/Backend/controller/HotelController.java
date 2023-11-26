package hcmute.kltn.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.hotel.dto.HotelCreate;
import hcmute.kltn.Backend.model.hotel.dto.HotelDTO;
import hcmute.kltn.Backend.model.hotel.dto.HotelSearch;
import hcmute.kltn.Backend.model.hotel.dto.HotelUpdate;
import hcmute.kltn.Backend.model.hotel.service.IHotelService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/hotels")
@Tag(name = "Hotels", description = "APIs for managing hotels")
@SecurityRequirement(name = "Bearer Authentication")
public class HotelController {
	@Autowired
	private IHotelService iHotelService;
	@Autowired
	private IResponseObjectService iResObjService;
	
	private final String createHotelDesc = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'eHotelId': ''\n"
			+ "- 'hotelName': ''\n"
			+ "- 'contact': ''\n"
			+ "- 'address': ''\n";
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Operation(summary = "Create hotel - ADMIN", description = createHotelDesc)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	ResponseEntity<ResponseObject> createHotel(@RequestBody HotelCreate hotelCreate) {
		HotelDTO hotelDTO = iHotelService.createHotel(hotelCreate);
		
		return iResObjService.success(new Response() {
			{
				setMessage("Create hotel successfully");
				setData(hotelDTO);
			}
		});
	}
	
	private final String updateHotelDesc = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'hotelName': ''\n"
			+ "- 'contact': ''\n"
			+ "- 'address': ''\n";
	@RequestMapping(value = "/update", method = RequestMethod.PUT)
	@Operation(summary = "Update hotel - ADMIN", description = updateHotelDesc)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	ResponseEntity<ResponseObject> updateHotel(@RequestBody HotelUpdate hotelUpdate) {
		HotelDTO hotelDTO = iHotelService.updateHotel(hotelUpdate);
		
		return iResObjService.success(new Response() {
			{
				setMessage("Update hotel successfully");
				setData(hotelDTO);
			}
		});
	}
	
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@Operation(summary = "Get hotel detail - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	ResponseEntity<ResponseObject> getDetailHotel(@RequestParam String hotelId) {
		HotelDTO hotelDTO = iHotelService.getDetailHotel(hotelId);
		
		return iResObjService.success(new Response() {
			{
				setMessage("Get hotel detail successfully");
				setData(hotelDTO);
			}
		});
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(summary = "Get all hotel - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	ResponseEntity<ResponseObject> getAllHotel() {
		List<HotelDTO> hotelDTOList = iHotelService.getAllHotel();
		
		return iResObjService.success(new Response() {
			{
				setMessage("Get all hotel successfully");
				setData(hotelDTOList);
			}
		});
	}
	
	@RequestMapping(value = "/search", method = RequestMethod.GET)
	@Operation(summary = "Search hotel - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	ResponseEntity<ResponseObject> searchHotel(@ModelAttribute HotelSearch hotelSearch) {
		List<HotelDTO> hotelDTOList = iHotelService.searchHotel(hotelSearch);
		
		return iResObjService.success(new Response() {
			{
				setMessage("Search hotel successfully");
				setData(hotelDTOList);
			}
		});
	}
}
