package hcmute.kltn.Backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.order.dto.OrderCreate;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;
import hcmute.kltn.Backend.model.order.dto.OrderStatusUpdate;
import hcmute.kltn.Backend.model.order.service.IOrderService;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/orders")
@Tag(
		name = "Orders", 
		description = "APIs for managing orders\n\n"
		+ "18/12/2023\n\n"
		+ "Cập nhật luồng: khi cập nhật trạng thái tour là finished, field numberOfOrdered sẽ cộng thêm 1 "
		+ "(đây là số đơn đã đặt trên 1 tour)\n\n"
		+ "9:00PM\n\n"
		+ "Thêm List<Member> trong CustomerInformation để nhập thông tin người đi cùng (người đi cùng sẽ trừ người đại diện "
		+ " là customer)\n\n"
		+ "- Chỗ gender cho chọn check box rồi FE kiểm tra và lấy giá trị là Nam hoặc Nữ "
		+ "(gender cho nhập gì cũng được nên giá trị là Nam hay Nữ lấy từ FE xuống nha)\n\n"
		+ "Thêm tuổi và giới tính cho CustomerInformation (xem nếu cần thì thêm trên giao diện)",
		externalDocs = @ExternalDocumentation(
				description = "Update Api History", 
				url = "https://drive.google.com/file/d/1G8DN3460uuAVgkwhOTvseSdWPT_4nAP3/view?usp=sharing")
		)
@SecurityRequirement(name = "Bearer Authentication")
public class OrderController {
	@Autowired
	private IOrderService iOrderService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	private final String createOrderDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'startDate': ''\n"
			+ "- 'customerInformation': ''\n"
			+ "- 'numberOfChildren': ''\n"
			+ "- 'numberOfAdult': ''\n";
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Operation(summary = "Create order - CUSTOMER", description = createOrderDescription)
	@PreAuthorize("hasAnyRole('ROLE_CUSTOMER')")
	ResponseEntity<ResponseObject> createOrder(
			@RequestBody OrderCreate orderCreate) {
		OrderDTO orderDTO = iOrderService.createOrder(orderCreate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create order successfully");
				setData(orderDTO);
			}
		});
	}
	
//	private final String updateOrderDescription = "Các field bắt buộc phải nhập:\n\n"
//			+ "- 'startDate': ''\n"
//			+ "- 'endDate': ''\n"
//			+ "- 'customerInformation': ''\n"
//			+ "- 'numberOfChildren': ''\n"
//			+ "- 'numberOfAdult': ''\n";
//	@RequestMapping(value = "/update", method = RequestMethod.PUT)
//	@Operation(summary = "Update order - STAFF", description = updateOrderDescription)
//	@PreAuthorize("hasAnyRole('ROLE_STAFF')")
//	ResponseEntity<ResponseObject> updateOrder(
//			@RequestBody OrderUpdate orderUpdate) {
//		Order order = iOrderService.updateOrder(orderUpdate);
//		
//		return iResponseObjectService.success(new Response() {
//			{
//				setMessage("Update order successfully");
//				setData(order);
//			}
//		});
//	}
	
	private final String updateOrderStatus = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'orderId': ''\n"
			+ "- 'status': ''\n\n"
			+ "status Nhập số tương ứng như sau:\n\n"
			+ "- 0 : canceled\n"
			+ "- 1 : pending\n"
			+ "- 2 : confirmed\n"
			+ "- 3 : underway\n"
			+ "- 4 : finished\n";
	@RequestMapping(value = "/status/update", method = RequestMethod.PUT)
	@Operation(summary = "Update order status - ADMIN / STAFF", description = updateOrderStatus)
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> updateOrderStatus(
			@RequestBody OrderStatusUpdate orderStatusUpdate) {
		OrderDTO orderDTO = iOrderService.updateOrderStatus(orderStatusUpdate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Update order status successfully");
				setData(orderDTO);
			}
		});
	}
	
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@Operation(summary = "Get order - ADMIN / STAFF / CUSTOMER")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> updateOrder(
			@RequestParam String orderId) {
		OrderDTO orderDTO = iOrderService.getDetailOrder(orderId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get detail order successfully");
				setData(orderDTO);
			}
		});
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(summary = "Get all order - ADMIN / STAFF / CUSTOMER")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> getAllOrder() {
		List<OrderDTO> orderDTOList = iOrderService.getAllOrder();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get all order successfully");
				setData(orderDTOList);
			}
		});
	}
	
	@RequestMapping(value = "/search", method = RequestMethod.GET)
	@Operation(summary = "Search order by keyword - ADMIN / STAFF / CUSTOMER")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> searchOrder(
			@RequestParam String keyword) {
		List<OrderDTO> orderDTOList = iOrderService.searchOrder(keyword);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search order successfully");
				setData(orderDTOList);
			}
		});
	}
}
