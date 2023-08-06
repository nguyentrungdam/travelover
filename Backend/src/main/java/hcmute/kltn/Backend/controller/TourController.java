package hcmute.kltn.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.ResponseObject;
import hcmute.kltn.Backend.model.dto.RegisterRequest;
import hcmute.kltn.Backend.model.dto.TourDTO;
import hcmute.kltn.Backend.model.entity.Account;
import hcmute.kltn.Backend.model.entity.Tour;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;
import hcmute.kltn.Backend.service.intf.ITourService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/tours")
@Tag(name = "Tours", description = "APIs for managing tours")
@SecurityRequirement(name = "Bearer Authentication")
public class TourController {
	@Autowired
	private ITourService iTourService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	private final String createTourDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'tourTitle': ''\n"
			+ "- 'numberOfDay': ''\n"
			+ "- 'numberOfNight': ''\n"
			+ "- 'provinceOrCity': ''\n"
			+ "- 'districtOrCounty': ''\n"
			+ "- 'wardOrCommune': ''\n"
			+ "- 'contact': ''\n"
			+ "- 'price': ''\n";
	@RequestMapping(value = "/create", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Create tour - STAFF", description = createTourDescription)
	@PreAuthorize("hasAuthority('ROLE_STAFF')")
//	@ModelAttribute
	ResponseEntity<ResponseObject> createTour(
			@RequestParam(required = false) MultipartFile fileThumbnail, 
			TourDTO tourDTO) {
		Tour tour = iTourService.createTour(fileThumbnail, tourDTO);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Create Tour successfully");
				setData(tour);
			}
		});
	}
	
	private final String updateTourDescription = "Yêu cầu: get detail của tour rồi dán các field bắt buộc vào"
			+ "Các field bắt buộc phải nhập:\n\n"
			+ "- 'tourId': ''\n"
			+ "- 'tourTitle': ''\n"
			+ "- 'thumbnail': ''\n"
			+ "- 'numberOfDay': ''\n"
			+ "- 'numberOfNight': ''\n"
			+ "- 'provinceOrCity': ''\n"
			+ "- 'districtOrCounty': ''\n"
			+ "- 'wardOrCommune': ''\n"
			+ "- 'contact': ''\n"
			+ "- 'price': ''\n\n"
			+ "Để xóa hình ảnh thumbnail có sẵn thì xóa luôn field thumbnail";
	@RequestMapping(value = "/update/", method = RequestMethod.PUT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Update tour - STAFF", description = updateTourDescription)
	@PreAuthorize("hasAuthority('ROLE_STAFF')")
//	@ModelAttribute
	ResponseEntity<ResponseObject> updateTour(
			@RequestParam(required = false) MultipartFile fileThumbnail,
			TourDTO tourDTO) {
		Tour tour = iTourService.updateTour(fileThumbnail, tourDTO);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Update tour successfulle");
				setData(tour);
			}
		});
	}
	
	@RequestMapping(value = "/detail/{tourId}", method = RequestMethod.GET)
	@Operation(summary = "Get tour detail")
	ResponseEntity<ResponseObject> getDetail(@PathVariable String tourId) {
		Tour tour = iTourService.getDetail(tourId);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Get detail tour successfully");
				setData(tour);
			}
		});
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(summary = "Get all tour")
	ResponseEntity<ResponseObject> getAllTour() {
		List<Tour> list = iTourService.getAll();
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Get all tour successfully");
				setCountData(list.size());
				setData(list);
			}
		});
	}
}
