package hcmute.kltn.Backend.model.order.service;

import java.util.List;

import hcmute.kltn.Backend.model.order.dto.OrderCreate;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;
import hcmute.kltn.Backend.model.order.dto.OrderStatusUpdate;
import hcmute.kltn.Backend.model.order.dto.OrderUpdate;
import hcmute.kltn.Backend.model.order.dto.entity.Order;

public interface IOrderService {
	public Order createOrder(OrderCreate orderCreate);
	public Order updateOrder(OrderUpdate orderUpdate);
	public Order updateOrderStatus(OrderStatusUpdate orderStatusUpdate);
	public Order getDetailOrder(String orderId);
	public List<Order> getAllOrder();
	public List<Order> searchOrder(String keyword);
} 
