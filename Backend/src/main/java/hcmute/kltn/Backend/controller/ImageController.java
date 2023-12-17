package hcmute.kltn.Backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.base.image.dto.Image;
import hcmute.kltn.Backend.model.base.image.dto.ImageCreate;
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/images")
@Tag(
		name = "Images TEST", 
		description = "APIs for managing images",
		externalDocs = @ExternalDocumentation(
				description = "Update Api History", 
				url = "https://drive.google.com/file/d/1I-WwINoVR1vnfv-1H3rs5sw4uvDPsTWc/view?usp=sharing")
		)
@SecurityRequirement(name = "Bearer Authentication")
public class ImageController {
	@Autowired
	private IImageService iImageService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	private final String createImageDesc = "Tải file có type = image, size <= 2MB";
	@RequestMapping(value = "/create", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Create image - LOGIN", description = createImageDesc)
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> createImage(
			@ModelAttribute MultipartFile file) {
		Image image = iImageService.createImage(file);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create Image successfully");
				setData(image);
			}
		});
	}
	
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@Operation(summary = "Get image detail - LOGIN")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> getDetail(@RequestParam String imageId) {
		Image image = iImageService.getImageDetail(imageId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get image detail successfully");
				setData(image);
			}
		});
	}
	
	@RequestMapping(value = "/delete", method = RequestMethod.DELETE)
	@Operation(summary = "Delete image - LOGIN")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> deleteImage(
			@RequestParam String imageId) {
		boolean checkDelete = iImageService.deleteImage(imageId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Delete image successfully");
			}
		});
	}
	
//	private final String updateTourDescription = "Yêu cầu: get detail của tour rồi dán các field bắt buộc vào"
//			+ "Các field bắt buộc phải nhập:\n\n"
//			+ "- 'tourId': ''\n"
//			+ "- 'tourTitle': ''\n"
//			+ "- 'thumbnail': ''\n"
//			+ "- 'numberOfDay': ''\n"
//			+ "- 'numberOfNight': ''\n"
//			+ "- 'provinceOrCity': ''\n"
//			+ "- 'districtOrCounty': ''\n"
//			+ "- 'wardOrCommune': ''\n"
//			+ "- 'contact': ''\n"
//			+ "- 'price': ''\n\n"
//			+ "Để xóa hình ảnh thumbnail có sẵn thì xóa luôn field thumbnail";
//	@RequestMapping(value = "/update/", method = RequestMethod.PUT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	@Operation(summary = "Update tour - STAFF", description = updateTourDescription)
//	@PreAuthorize("hasAuthority('ROLE_STAFF')")
//	@ModelAttribute
//	ResponseEntity<ResponseObject> updateTour(
//			@RequestParam(required = false) MultipartFile fileThumbnail,
//			TourDTO tourDTO) {
//		Tour tour = iTourService.updateTour(fileThumbnail, tourDTO);
//		
//		return iResponseObjectService.success(new Response() {
//			{
//				setMessage("Update tour successfulle");
//				setData(tour);
//			}
//		});
//	}
//	

//	
//	@RequestMapping(value = "/list", method = RequestMethod.GET)
//	@Operation(summary = "Get all tour")
//	ResponseEntity<ResponseObject> getAllTour() {
//		List<Tour> list = iTourService.getAll();
//		
//		return iResponseObjectService.success(new Response() {
//			{
//				setMessage("Get all tour successfully");
//				setData(list);
//			}
//		});
//	}
	
//	@RequestMapping(value = "/test", method = RequestMethod.GET)
//	@Operation(summary = "Get byte image")
//	public byte[] test(
//			@RequestParam String fileName) {
//		String path = System.getProperty("user.dir") + "/" + "src/main/resources/static/images" +"/" + fileName;
//		Path pathNew = Paths.get(path);
//		
//		byte[] imageByte = null;
//		try {
//			imageByte = Files.readAllBytes(pathNew);
//		} catch (Exception e) {
//			System.out.println("Read byte image fail");
//		}
//		
//		return imageByte;
//	}
}