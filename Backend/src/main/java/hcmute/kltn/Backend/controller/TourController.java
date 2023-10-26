package hcmute.kltn.Backend.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.tour.dto.extend.Address;
import hcmute.kltn.Backend.model.tour.dto.extend.ReasonableTime;
import hcmute.kltn.Backend.model.tour.service.ITourService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
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
			+ "- 'address': ''\n"
			+ "- 'TourDetail': ''\n"
			+ "- 'reasonableTime': dữ liệu Date có định dạng dd/mm''\n";
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Operation(summary = "Create tour - STAFF", description = createTourDescription)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> createTour(
			@RequestBody TourCreate tourCreate) {
		
		Tour tour = iTourService.createTour(tourCreate);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Create Tour successfully");
				setData(tour);
			}
		});
	}

	
	private final String updateTourDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'tourId': ''\n"
			+ "- 'tourTitle': ''\n"
			+ "- 'numberOfDay': ''\n"
			+ "- 'address': ''\n"
			+ "- 'TourDetail': ''\n"
			+ "- 'reasonableTime': dữ liệu Date có định dạng dd/mm''\n";
	@RequestMapping(value = "/update/", method = RequestMethod.PUT)
	@Operation(summary = "Update tour - STAFF", description = updateTourDescription)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> updateTour(
			@RequestBody TourUpdate tourUpdate) {
		Tour tour = iTourService.updateTour(tourUpdate);
		
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