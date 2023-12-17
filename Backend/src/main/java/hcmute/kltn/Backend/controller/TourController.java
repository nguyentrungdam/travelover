package hcmute.kltn.Backend.controller;

import java.util.HashMap;
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

import hcmute.kltn.Backend.model.base.Pagination;
import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourFilter;
import hcmute.kltn.Backend.model.tour.dto.TourSearch;
import hcmute.kltn.Backend.model.tour.dto.TourSearchRes;
import hcmute.kltn.Backend.model.tour.dto.TourSort;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.service.ITourService;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/tours")
@Tag(
		name = "Tours", 
		description = "APIs for managing tours\n\n"
		+ "14/12/2023\n\n"
		+ "Thêm api list discount tour: danh sách tour đang giảm giá nhiều nhất\n\n"
		+ "Fix api update với lỗi: khi không nhập schedule thì báo lỗi\n\n"
		+ "Fix api update với lỗi: với khi không nhập discount thì báo lỗi\n\n"
		+ "Fix api update với lỗi: khi nhấn update thì tự động xóa hết ảnh",
		externalDocs = @ExternalDocumentation(
				description = "Update Api History", 
				url = "https://drive.google.com/file/d/1jrATNUoOWUdZ64oVM93gr9x_sDQnMvmX/view?usp=sharing")
		)
@SecurityRequirement(name = "Bearer Authentication")
public class TourController {
	@Autowired
	private ITourService iTourService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	private final String createTourDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'tourTitle': ''\n"
			+ "- 'numberOfDay': ''\n"
			+ "- 'address': ''\n"
			+ "- 'TourDetail': ''\n"
			+ "- 'reasonableTime': ''\n";
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Operation(summary = "Create tour - ADMIN / STAFF", description = createTourDescription)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> createTour(
			@RequestBody TourCreate tourCreate) {
		iTourService.updateIsDiscount();
		TourDTO tourDTO = iTourService.createTour(tourCreate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create Tour successfully");
				setData(tourDTO);
			}
		});
	}

	
	private final String updateTourDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'tourId': ''\n"
			+ "- 'tourTitle': ''\n"
			+ "- 'numberOfDay': ''\n"
			+ "- 'address': ''\n"
			+ "- 'TourDetail': ''\n"
			+ "- 'reasonableTime': ''\n";
	@RequestMapping(value = "/update", method = RequestMethod.PUT)
	@Operation(summary = "Update tour - ADMIN / STAFF", description = updateTourDescription)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> updateTour(
			@RequestBody TourUpdate tourUpdate) {
		iTourService.updateIsDiscount();
		TourDTO tourDTO = iTourService.updateTour(tourUpdate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Update tour successfully");
				setData(tourDTO);
			}
		});
	}
	
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@Operation(summary = "Get tour detail")
	ResponseEntity<ResponseObject> getDetail(@RequestParam String tourId) {
		iTourService.updateIsDiscount();
		TourDTO tourDTO = iTourService.getDetailTour(tourId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get detail tour successfully");
				setData(tourDTO);
			}
		});
	}
	
	private final String getAllTourDesc = "Các field bắt buộc phải nhập:\n"
			+ "- 'pageSize': ''\n"
			+ "- 'pageNumber': ''\n\n"
			+ "pageSize: Số lượng item có trong 1 trang\n\n"
			+ "pageNumber: Trang hiện tại\n\n"
			+ "Các trường hợp sử dụng\n"
			+ "- Không phân trang: pageSize = 0, pageNumber = 0\n"
			+ "- - pageSize = 0\n"
			+ "- - pageNumber = 0\n"
			+ "- Có phân trang: \n"
			+ "- - pageSize > 0\n"
			+ "- - pageNumber > 0\n"
			+ "- Lấy trang cuối cùng: \n"
			+ "- - pageSize > 0\n"
			+ "- - pageNumber = -1\n";
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(summary = "Get all tour - ADMIN / STAFF", description = getAllTourDesc)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> getAllTour(
			@ModelAttribute Pagination Pagination) {
		iTourService.updateIsDiscount();
		List<TourDTO> tourDTOList = iTourService.getAllTour();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get all tour successfully");
				setPageSize(Pagination.getPageSize());
				setPageNumber(Pagination.getPageNumber());
				setData(tourDTOList);
			}
		});
	}
	
	@RequestMapping(value = "/discount/update", method = RequestMethod.GET)
	@Operation(summary = "Manual update isDiscount - ADMIN / STAFF")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> updateIsDiscountNoCheck() {
		iTourService.updateIsDiscountNoCheck();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("update isDiscount successfully");
			}
		});
	}
	
	private final String searchTourDesc = "Các field bắt buộc phải nhập (áp dụng cho Pagination):\n"
			+ "- 'pageSize': ''\n"
			+ "- 'pageNumber': ''\n\n"
			+ "pageSize: Số lượng item có trong 1 trang\n\n"
			+ "pageNumber: Trang hiện tại\n\n"
			+ "Các trường hợp sử dụng\n"
			+ "- Không phân trang: pageSize = 0, pageNumber = 0\n"
			+ "- - pageSize = 0\n"
			+ "- - pageNumber = 0\n"
			+ "- Có phân trang: \n"
			+ "- - pageSize > 0\n"
			+ "- - pageNumber > 0\n"
			+ "- Lấy trang cuối cùng: \n"
			+ "- - pageSize > 0\n"
			+ "- - pageNumber = -1\n\n"
			+ "tourFilter: không dùng thì không truyền gì hết\n"
			+ "- - minPrice >= 0\n"
			+ "- - maxPrice >= minPrice\n"
			+ "- - 1 <= ratingFilter <= 5\n\n"
			+ "tourSort: không dùng thì không truyền gì hết (chưa xử lý promotion)\n"
			+ "- - sortBy = 1 trong 3 loại là popular, price, promotion\n"
			+ "- - order = 1 trong 2 loại là asc, desc\n";
	@RequestMapping(value = "/search", method = RequestMethod.GET)
	@Operation(summary = "Search tour", description = searchTourDesc)
//	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> searchTour(
			@ModelAttribute TourSearch tourSearch,
			@ModelAttribute TourFilter tourFilter,
			@ModelAttribute TourSort tourSort,
			@ModelAttribute Pagination Pagination) {
		iTourService.updateIsDiscount();
		List<TourSearchRes> tourList = iTourService.searchTour(tourSearch);
		
		List<TourSearchRes> tourFilterList = iTourService.searchFilter(tourFilter, tourList);
		
		List<TourSearchRes> tourSortList = iTourService.searchSort(tourSort, tourFilterList);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search tour successfully");
				setPageSize(Pagination.getPageSize());
				setPageNumber(Pagination.getPageNumber());
				setData(tourSortList);
			}
		});
	}
	
	private final String getAllDiscountTourDes = "Lấy ra 10 tour giảm giá nhiều nhất cho 1 người lớn và 1 phòng";
	@RequestMapping(value = "/list-discount-tour", method = RequestMethod.GET)
	@Operation(summary = "Get 10 discount tour", description = getAllDiscountTourDes)
	ResponseEntity<ResponseObject> getAllDiscountTour() {
		iTourService.updateIsDiscount();
		List<TourSearchRes> tourSearchResList = iTourService.getAllDiscountTour();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get 10 discount tour successfully");
				setData(tourSearchResList);
			}
		});
	}
}