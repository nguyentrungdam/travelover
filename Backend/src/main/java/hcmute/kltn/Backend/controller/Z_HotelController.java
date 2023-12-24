package hcmute.kltn.Backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.base.Pagination;
import hcmute.kltn.Backend.model.base.Sort;
import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.RoomSearchRes;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.entity.EHotel;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Order;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room2;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.service.IEHotelService;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

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
			+ "- 'numberOfStarRating': '' (giá trị từ 1 đến 5)\n\n"
			+ "Khi gọi create sẽ tự tạo ra danh sách phòng dựa trên số sao đánh giá (biến phòng mới là room2)";
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
	ResponseEntity<ResponseObject> getAllEHotel(
			@ModelAttribute Pagination pagination) {
		
		List<EHotel> eHotelList = iEHotelService.getAllEHotel();
		
		// default sort
		Sort sort = new Sort();
		sort.setSortBy("createdAt2");
		sort.setOrder("desc");
		List<EHotel> eHotelListNew = new ArrayList<>();
		eHotelListNew.addAll(iEHotelService.listEHotelSort(sort, eHotelList));
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get All Enterprise Hotel successfully");
				setPageSize(pagination.getPageSize());
				setPageNumber(pagination.getPageNumber());
				setData(eHotelListNew);
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
	
	private final String listEHotelSearchDesc = "Search hotel bằng keyword, search trên bảng hotel "
			+ "- filter: nhập dạng 'tên field': 'giá trị' (thêm bao nhiêu field tùy ý, "
			+ "khi filter sẽ tìm đúng tên field và xem giá trị từ account có chứa giá trị nhập vào)\n\n"
			+ "- - 'hotelDescription': 'Khách sạn',\n\n"
			+ "- - 'createdAt2': '2023-12'\n\n"
			+ "- sort: nhập tên field và kiểu sort có 2 kiểu là asc hoặc desc (chỉ sort theo 1 cột)";
	@RequestMapping(value = "/list/search", method = RequestMethod.GET)
	@Operation(
			tags = "Z Enterprise Hotels", 
			summary = "Search ehotel for admin page - ADMIN / STAFF", 
			description = listEHotelSearchDesc)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> listEHotelSearch(
			@RequestParam(required = false) String keyword,
			@RequestParam HashMap<String, String> filter,
			@ModelAttribute Sort sort,
			@ModelAttribute Pagination pagination) {
		List<EHotel> eHotelDTOList = iEHotelService.listEHotelSearch(keyword);
		List<EHotel> eHotelDTOFilterList = iEHotelService.listEHotelFilter(filter, eHotelDTOList);
		if (sort == null) {
			sort = new Sort();
			sort.setSortBy("createdAt2");
			sort.setOrder("desc");
		} else if (sort.getSortBy() == null) {
			sort.setSortBy("createdAt2");
			sort.setOrder("desc");
		} else if (sort.getSortBy().isEmpty()) {
			sort.setSortBy("createdAt2");
			sort.setOrder("desc");
		}
		List<EHotel> eHotelDTOSortList = iEHotelService.listEHotelSort(sort, eHotelDTOFilterList);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search ehotel for admin page successfully");
				setPageSize(pagination.getPageSize());
				setPageNumber(pagination.getPageNumber());
				setData(eHotelDTOSortList);
			}
		});
	}
	
	@RequestMapping(value = "/room/search", method = RequestMethod.GET)
	@Operation(tags = "Z Enterprise Hotels - Room", summary = "Search room - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ENTERPRISE')")
	ResponseEntity<ResponseObject> searchRoom(@ModelAttribute RoomSearch roomSearch) {
//		System.out.println("room search = " + roomSearch);
		
		List<Room> roomList = iEHotelService.searchRoom(roomSearch);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search room successfully");
				setData(roomList);
			}
		});
	}
	
	@RequestMapping(value = "/room/search2", method = RequestMethod.GET)
	@Operation(tags = "Z Enterprise Hotels - Room", summary = "Search room 2 - ADMIN")
	ResponseEntity<ResponseObject> searchRoom2(@ModelAttribute RoomSearch roomSearch) {
//		System.out.println("room search = " + roomSearch);
		
		List<RoomSearchRes> roomMap = iEHotelService.searchRoom2(roomSearch);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search room 2 successfully");
				setData(roomMap);
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
