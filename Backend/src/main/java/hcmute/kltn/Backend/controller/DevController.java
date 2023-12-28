package hcmute.kltn.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.dev.service.IDevService;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/devs")
@Tag(
		name = "Devs", 
		description = "APIs for managing devs\n\n"
				+ "__28/12/2023__\n\n"
				+ "__1:15PM__\n\n"
				+ "__Z Enterprise Hotels (api cho bên thứ 3 enterprise)__\n\n"
				+ "Tạo mới: api order/create để tạo đơn hàng giả lập trường hợp bên thứ 3 "
				+ "có các phòng đã được đặt vào thời điểm tour cần đi\n\n"
				+ "Tạo mới: api order/status/update để cập nhật trạng thái đơn hàng cho bên thứ 3\n\n"
				+ "Tạo mới: api location/search để tìm ra hotel dựa trên 3 cấp "
				+ "(search province thì district bổ trống, search district bắt buộc phải có province)\n\n"
				+ "- Dùng lúc vào xem chi tiết tour sau khi search từ trang chủ, dùng api này để tìm ra các "
				+ "ehotel phù hợp rồi tiếp tục dùng api searchRoom2 để tìm phòng phù hợp\n\n"
				+ "- Tạm thời trên FE gán như vậy xem có gặp bất cập gì không rồi từ từ t chỉnh sau cho phù hợp\n\n",
		externalDocs = @ExternalDocumentation(
				description = "Update Api History", 
				url = "https://drive.google.com/file/d/176XCXAx04e66xHKIOnL2V1smcR2fiEGo/view?usp=sharing")
		)
@SecurityRequirement(name = "Bearer Authentication")
public class DevController {
	@Autowired
	private IDevService iDevService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	private final String updateNewDateTimeDesc = "Chạy để cập nhật giá trị date-time cho biến date-time mới "
			+ "(biến mới bao gồm ngày và giờ, tên biến kèm thêm số 2 ở cuối)";
	@RequestMapping(value = "/update-new-date-time", method = RequestMethod.GET)
	@Operation(summary = "Update New DateTime - ADMIN / STAFF", description = updateNewDateTimeDesc)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> updateNewDateTime() {
		iDevService.updateNewDateTime();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Update New DateTime successfully");
			}
		});
	}
}
