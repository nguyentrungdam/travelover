package hcmute.kltn.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.statistic.dto.StatisticDTO;
import hcmute.kltn.Backend.model.statistic.dto.Time;
import hcmute.kltn.Backend.model.statistic.service.IStatisticService;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/statistics")
@Tag(
		name = "Statistics", 
		description = "APIs for managing statistics\n\n"
				+ "__04/01/2023__\n\n"
				+ "__7:10AM__\n\n"
				+ "Tạo mới: api turnover để tính doanh thu",
		externalDocs = @ExternalDocumentation(
				description = "Update Api History", 
				url = "https://drive.google.com/file/d/1RLBaIirb1s63rJOSpnedlTJoXh3kutYo/view?usp=sharing")
		)
@SecurityRequirement(name = "Bearer Authentication")
public class StatisticController {
	@Autowired
	private IResponseObjectService iResponseObjectService;
	@Autowired
	private IStatisticService iStatisticSerivce;
	
	private final String getTurnoverDesv = "Tính doanh thu\n\n"
			+ "2 biến year và month nhập số\n\n"
			+ "- year: '' (year >= 2023)\n\n"
			+ "- month: '' (1 <= month <= 12)\n\n"
			+ "Nhập 2 field để tính doanh thu theo ngày trong tháng\n\n"
			+ "Bỏ trống field month để tính doanh thu theo tháng trong năm\n\n"
			+ "Bỏ trống 2 field để tính doanh thu theo năm (tính từ 2023 tới năm hiện tại)";
	@RequestMapping(value = "/turnover", method = RequestMethod.GET)
	@Operation(summary = "Get turnover - ADMIN", description = getTurnoverDesv)
	@PreAuthorize("hasAnyRole('ROLE_STAFF')")
	ResponseEntity<ResponseObject> getTurnover(
			@ModelAttribute Time time) {
		StatisticDTO statisticDTO = iStatisticSerivce.getTurnover(time);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get Detail Discount successfully");
				setData(statisticDTO);
			}
		});
	}
}
