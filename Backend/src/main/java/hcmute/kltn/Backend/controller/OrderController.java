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
import hcmute.kltn.Backend.model.order.dto.OrderStatusUpdate;
import hcmute.kltn.Backend.model.order.dto.OrderUpdate;
import hcmute.kltn.Backend.model.order.dto.entity.Order;
import hcmute.kltn.Backend.model.order.service.IOrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/orders")
@Tag(name = "Orders", description = "APIs for managing orders")
@SecurityRequirement(name = "Bearer Authentication")
public class OrderController {
	@Autowired
	private IOrderService iOrderService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	private final String createOrderDescription = "Các field bắt buộc phải nhập:\n\n"
			+ "- 'startDate': ''\n"
			+ "- 'endDate': ''\n"
			+ "- 'customerInformation': ''\n"
			+ "- 'numberOfChildren': ''\n"
			+ "- 'numberOfAdult': ''\n";
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Operation(summary = "Create order - CUSTOMER", description = createOrderDescription)
	@PreAuthorize("hasAnyRole('ROLE_CUSTOMER')")
	ResponseEntity<ResponseObject> createOrder(
			@RequestBody OrderCreate orderCreate) {
		Order order = iOrderService.createOrder(orderCreate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create order successfully");
				setData(order);
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
		Order order = iOrderService.updateOrderStatus(orderStatusUpdate);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Update order status successfully");
				setData(order);
			}
		});
	}
	
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@Operation(summary = "Get order - ADMIN / STAFF / CUSTOMER")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> updateOrder(
			@RequestParam String orderId) {
		Order order = iOrderService.getDetailOrder(orderId);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get detail order successfully");
				setData(order);
			}
		});
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(summary = "Get all order - ADMIN / STAFF / CUSTOMER")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> getAllOrder() {
		List<Order> orderList = iOrderService.getAllOrder();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get all order successfully");
				setData(orderList);
			}
		});
	}
	
	@RequestMapping(value = "/search", method = RequestMethod.GET)
	@Operation(summary = "Search order by keyword - ADMIN / STAFF / CUSTOMER")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> searchOrder(
			@RequestParam String keyword) {
		List<Order> orderList = iOrderService.searchOrder(keyword);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search order successfully");
				setData(orderList);
			}
		});
	}
}
