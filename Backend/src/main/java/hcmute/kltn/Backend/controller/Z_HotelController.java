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
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.entity.EHotel;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Order;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.service.IEHotelService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping(path = "/api/v1/ehotels")
@SecurityRequirement(name = "Bearer Authentication")
public class Z_HotelController {
	@Autowired
	private IResponseObjectService iResponseObjectService;
	@Autowired
	private IEHotelService iEHotelService;
	
	private final String createHotelDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'hotelName': ''\n"
			+ "- 'phoneNumber': ''\n"
			+ "- 'address': ''\n"
			+ "- 'room': ''\n";
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Operation(tags = "Z Enterprise Hotels", summary = "Create Hotel - ADMIN", description = createHotelDescription)
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> createEHotel(
			@RequestBody EHotelCreate eHotelCreate) {
		
		EHotel eHotel = iEHotelService.createEHotel(eHotelCreate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create Enterprise Hotel successfully");
				setData(eHotel);
			}
		});
	}
	
	private final String updateHotelDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'hotelId': ''\n"
			+ "- 'hotelName': ''\n"
			+ "- 'phoneNumber': ''\n"
			+ "- 'address': ''\n"
			+ "- 'room': ''\n";
	@RequestMapping(value = "/update", method = RequestMethod.PUT)
	@Operation(tags = "Z Enterprise Hotels", summary = "Update Hotel - ADMIN", description = updateHotelDescription)
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> updateEHotel(
			@RequestBody EHotelUpdate eHotelUpdate) {
		
		EHotel eHotel = iEHotelService.updateEHotel(eHotelUpdate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Update Enterprise Hotel successfully");
				setData(eHotel);
			}
		});
	}
	
	private final String detailHotelDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'hotelId': ''\n";
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@Operation(tags = "Z Enterprise Hotels", summary = "Get Hotel detail- ADMIN", description = detailHotelDescription)
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> getEHotelDetail(
			@RequestParam String eHotelId) {
		
		EHotel eHotel = iEHotelService.getDetailEHotel(eHotelId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get Enterprise Hotel detail successfully");
				setData(eHotel);
			}
		});
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(tags = {"Z Enterprise Hotels"}, summary = "Get all EHotel - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> getAllEHotel() {
		
		List<EHotel> eHotelList = iEHotelService.getAllEHotel();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get All Enterprise Hotel successfully");
				setData(eHotelList);
			}
		});
	}
	
	@RequestMapping(value = "/search", method = RequestMethod.GET)
	@Operation(tags = "Z Enterprise Hotels", summary = "Search hotel by keyword- ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> searchEHotel(@RequestParam String keyword) {
		List<EHotel> eHotelList = iEHotelService.searchEHotel(keyword);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search enterprise hotel successfully");
				setData(eHotelList);
			}
		});
	}
	
	@RequestMapping(value = "/room/search", method = RequestMethod.GET)
	@Operation(tags = "Z Enterprise Hotels - Room", summary = "Search room - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> searchRoom(@ModelAttribute RoomSearch roomSearch) {
		System.out.println("room search = " + roomSearch);
		
		List<Room> roomList = iEHotelService.searchRoom(roomSearch);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search room successfully");
				setData(roomList);
			}
		});
	}
	
	@RequestMapping(value = "/order/create", method = RequestMethod.POST)
	@Operation(tags = "Z Enterprise Hotels - Order", summary = "Create Order Hotel - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> createOrderEHotel(
			@RequestBody EHotelOrderCreate eHotelOrderCreate) {
		
		Order order = iEHotelService.createOrder(eHotelOrderCreate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create Order Enterprise Hotel successfully");
				setData(order);
			}
		});
	}
	
	@RequestMapping(value = "/order/update", method = RequestMethod.PUT)
	@Operation(tags = "Z Enterprise Hotels - Order", summary = "Update Order Hotel - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> updateOrderEHotel(
			@RequestBody EHotelOrderUpdate eHotelOrderUpdate) {
		
		Order order = iEHotelService.updateOrder(eHotelOrderUpdate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create Order Enterprise Hotel successfully");
				setData(order);
			}
		});
	}
	
	@RequestMapping(value = "/order/detail", method = RequestMethod.GET)
	@Operation(tags = "Z Enterprise Hotels - Order", summary = "Get one Order - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> getOneOrder(
			@RequestBody String eHotelId, String orderId) {
		
		Order order = iEHotelService.getOneOrder(eHotelId, orderId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get one Order successfully");
				setData(order);
			}
		});
	}
	
	@RequestMapping(value = "/order/list", method = RequestMethod.GET)
	@Operation(tags = "Z Enterprise Hotels - Order", summary = "Get all Order - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> getAllOrder(
			@RequestBody String eHotelId) {
		
		List<Order> order = iEHotelService.getAllOrder(eHotelId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get all Order successfully");
				setData(order);
			}
		});
	}
}
