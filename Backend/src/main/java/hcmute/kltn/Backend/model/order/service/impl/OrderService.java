package hcmute.kltn.Backend.model.order.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.base.EOrderStatus;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.model.hotel.dto.HotelDTO;
import hcmute.kltn.Backend.model.hotel.dto.entity.Hotel;
import hcmute.kltn.Backend.model.hotel.dto.extend.Room;
import hcmute.kltn.Backend.model.hotel.service.IHotelService;
import hcmute.kltn.Backend.model.order.dto.OrderCreate;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;
import hcmute.kltn.Backend.model.order.dto.OrderPaymentUpdate;
import hcmute.kltn.Backend.model.order.dto.OrderStatusUpdate;
import hcmute.kltn.Backend.model.order.dto.OrderUpdate;
import hcmute.kltn.Backend.model.order.dto.entity.Order;
import hcmute.kltn.Backend.model.order.dto.extend.HotelDetail;
import hcmute.kltn.Backend.model.order.dto.extend.OrderDetail;
import hcmute.kltn.Backend.model.order.dto.extend.Payment;
import hcmute.kltn.Backend.model.order.dto.extend.VOTourDetail;
import hcmute.kltn.Backend.model.order.repository.OrderRepository;
import hcmute.kltn.Backend.model.order.service.IOrderService;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.tour.dto.extend.TourDetail;
import hcmute.kltn.Backend.model.tour.service.ITourService;
import hcmute.kltn.Backend.util.LocalDateUtil;

@Service
public class OrderService implements IOrderService{
	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private IAccountDetailService iAccountDetailService;
	@Autowired
    private MongoTemplate mongoTemplate;
	@Autowired
	private IHotelService iHotelService;
	@Autowired
	private ITourService iTourService;
	
	private String getOrderStatus(String orderStatus) {
		int index = Integer.valueOf(orderStatus);
		
		List<String> orderStatusList = new ArrayList<>();
		for (EOrderStatus value : EOrderStatus.values()) {
			orderStatusList.add(String.valueOf(value));
		}
		
		if (index < 0 || index >= orderStatusList.size()) {
			return null;
		} 
		
		return orderStatusList.get(index);
	}

    private String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Order.class);
        return collectionName;
    }
    
    private void checkFieldCondition(Order order) {
		// check null
		LocalDate dateNow = LocalDateUtil.getDateNow();
		if(order.getStartDate() == null || order.getStartDate().isEqual(dateNow) || order.getStartDate().isBefore(dateNow)) {
			throw new CustomException("The start date must greater than the current date");
		}
//		if(order.getEndDate() == null || order.getEndDate().isEqual(dateNow) 
//				|| orderDTO.getEndDate().isBefore(dateNow) || orderDTO.getEndDate().isBefore(orderDTO.getStartDate())) {
//			throw new CustomException("The end date must greater or equal than the start date");
//		}
		if(order.getCustomerInformation() == null) {
			throw new CustomException("Customer Information is not null");
		}
		if(order.getNumberOfChildren() < 0) {
			throw new CustomException("Number of children must greater or equal than 0");
		}
		if(order.getNumberOfAdult() <= 0) {
			throw new CustomException("Number of adult must greate than 0");
		}
//		if(order.getPrice() <= 0) {
//			throw new CustomException("Price must greate than 0");
//		}
		if(order.getTotalPrice() <= 0) {
			throw new CustomException("Total price must greate than 0");
		}
		
		// check unique
	}
    
    private Order create(Order order) {
		// check field condition
		checkFieldCondition(order);
		
		// set default value
		String orderId = iGeneratorSequenceService.genId(getCollectionName());
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		order.setOrderId(orderId);
		order.setStatus(true);
		order.setCreatedBy(accountId);
		order.setCreatedAt(dateNow);
		order.setLastModifiedBy(accountId);
		order.setLastModifiedAt(dateNow);
		
		// create order
		Order orderNew = new Order();
		orderNew = orderRepository.save(order);
		
		return orderNew;
	}

//	private Order create(OrderDTO orderDTO) {
//		// check field condition
//		checkFieldCondition(orderDTO);
//		
//		// mapping
//		Order order = new Order();
//		modelMapper.map(orderDTO, order);
//		
//		// set default value
//		String orderId = iGeneratorSequenceService.genId(getCollectionName());
//		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
//		LocalDate dateNow = LocalDateUtil.getDateNow();
//		order.setOrderId(orderId);
//		order.setOrderStatus(getOrderStatus("1"));
//		order.setStatus(true);
//		order.setCreatedBy(accountId);
//		order.setCreatedAt(dateNow);
//		order.setLastModifiedBy(accountId);
//		order.setLastModifiedAt(dateNow);
//		
//		// create order
//		order = orderRepository.save(order);
//		
//		return order;
//	}
    
    private Order update(Order order) {
		// check exists
		if(!orderRepository.existsById(order.getOrderId())) {
			throw new CustomException("Cannot find order");
		}
		
		// check field condition
		checkFieldCondition(order);
		
		// set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		order.setLastModifiedBy(accountId);
		order.setLastModifiedAt(dateNow);
		
		// update order
		Order orderNew = new Order();
		orderNew = orderRepository.save(order);

		return orderNew;
	}

//	private Order update(OrderDTO orderDTO) {
//		// check exists
//		if(!orderRepository.existsById(orderDTO.getOrderId())) {
//			throw new CustomException("Cannot find order");
//		}
//		
//		// check field condition
//		checkFieldCondition(orderDTO);
//		
//		// get order from db
//		Order order = orderRepository.findById(orderDTO.getOrderId()).get();
//		
//		// mapping
//		modelMapper.map(orderDTO, order);
//		
//		// set default value
//		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
//		LocalDate dateNow = LocalDateUtil.getDateNow();
//		String orderStatus = getOrderStatus(orderDTO.getOrderStatus());
//		if (orderStatus == null) {
//			throw new CustomException("Order status does not exist");
//		}
//		order.setOrderStatus(orderStatus);
//		order.setLastModifiedBy(accountId);
//		order.setLastModifiedAt(dateNow);
//		
//		// update order
//		order = orderRepository.save(order);
//
//		return order;
//	}

	private Order getDetail(String orderId) {
		// check exists
		if(!orderRepository.existsById(orderId)) {
			throw new CustomException("Cannot find order");
		}
		
		// get order from db
		Order order = orderRepository.findById(orderId).get();
		
		return order;
	}

	private List<Order> getAll() {
		// get all order from db
		List<Order> orderList = orderRepository.findAll();
		
		return orderList;
	}

	private void delete(String orderId) {
		if (orderRepository.existsById(orderId)) {
			orderRepository.deleteById(orderId);
		}
	}

	private List<Order> search(String keyword) {
		// init Order List
		List<Order> orderList = new ArrayList<>();
		
		if(keyword == null || keyword.equals("")) {
			orderList = getAll();
		} else {
			// create list field name
			List<Criteria> criteriaList = new ArrayList<>();
			for(Field itemField : Order.class.getDeclaredFields()) {
				if(itemField.getType() == String.class) {
					criteriaList.add(Criteria.where(itemField.getName()).regex(keyword, "i"));
				}
			}
			criteriaList.add(Criteria.where("_id").is(keyword));
			
			// create criteria
			Criteria criteria = new Criteria();
			criteria.orOperator(criteriaList.toArray(new Criteria[0]));
			
			// create query
			Query query = new Query();
			query.addCriteria(criteria);
			
			// search
			orderList = mongoTemplate.find(query, Order.class);
		}

		return orderList;
	}
	
	private OrderDTO getOrderDTO(Order order) {
		OrderDTO orderDTONew = new OrderDTO();
		modelMapper.map(order, orderDTONew);
		return orderDTONew;
	}
	
	private List<OrderDTO> getOrderDTOList(List<Order> orderList) {
		List<OrderDTO> orderDTOList = new ArrayList<>();
		for (Order itemOrder : orderList) {
			orderDTOList.add(getOrderDTO(itemOrder));
		}
		return orderDTOList;
	}

	@Override
	public OrderDTO createOrder(OrderCreate orderCreate) {
		int totalPrice = 0;
		
		// mapping order
		Order order = new Order();
		modelMapper.map(orderCreate, order);
		
		// init order detail
		OrderDetail orderDetail = new OrderDetail();
		
		// get tour information
		orderDetail.setTourId(orderCreate.getTourId());
		
		TourDTO tourDTO = new TourDTO();
		tourDTO = iTourService.getDetailTour(orderCreate.getTourId());
		VOTourDetail vOTourDetail = new VOTourDetail();
		vOTourDetail.setTourTitle(tourDTO.getTourTitle());
		vOTourDetail.setThumbnailUrl(tourDTO.getThumbnailUrl());
//		vOTourDetail.setPrice(tourDTO.getPrice());
		/////////////////////////////////////////////////////////////////////////
		
		orderDetail.setTourDetail(vOTourDetail);
		
		// update total price
		totalPrice += vOTourDetail.getPrice();
		
		// update endDate
		LocalDate endDate = order.getStartDate().plusDays((long) (tourDTO.getNumberOfDay() - 1));
		order.setEndDate(endDate);
		
		// get hotel information
		List<HotelDetail> hotelDetailList = new ArrayList<>();
		orderDetail.setHotelId(orderCreate.getHotelId());
		HotelDTO hotelDTO = new HotelDTO();
		hotelDTO = iHotelService.getDetailHotel(orderCreate.getHotelId());
		for (String itemString : orderCreate.getRoomIdList()) {
			Room room = new Room();
			room = iHotelService.getRoomDetail(hotelDTO.getEHotelId(), itemString);
			HotelDetail hotelDetail = new HotelDetail();
			hotelDetail.setRoomId(room.getRoomId());
			hotelDetail.setCapacity(room.getCapacity());
			hotelDetail.setPrice(room.getPrice());
			
			hotelDetailList.add(hotelDetail);
			
			// update total price
			totalPrice += hotelDetail.getPrice();
		}
		
		orderDetail.setHotelDetail(hotelDetailList);
		
		// get vehicle information
		
		// get guider information
		
		order.setOrderDetail(orderDetail);
		order.setTotalPrice(totalPrice);
		order.setOrderStatus(getOrderStatus("1"));
		
		// create order
		Order orderNew = new Order();
		orderNew = create(order);

		return getOrderDTO(orderNew);
	}

	@Override
	public OrderDTO updateOrder(OrderUpdate orderUpdate) {
		// mapping order
		Order order = new Order();
		order = getDetail(orderUpdate.getOrderId());
		modelMapper.map(orderUpdate, order);
		
		// set default value
		String orderStatus = getOrderStatus(orderUpdate.getOrderStatus());
		if (orderStatus == null) {
			throw new CustomException("Order status does not exist");
		}
		order.setOrderStatus(orderStatus);
		
		// update order
		Order orderNew = new Order();
		orderNew = update(order);

		return getOrderDTO(orderNew);
	}

	@Override
	public OrderDTO getDetailOrder(String orderId) {
		Order order = getDetail(orderId);

		return getOrderDTO(order);
	}

	@Override
	public List<OrderDTO> getAllOrder() {
		List<Order> orderList = getAll();

		return getOrderDTOList(orderList);
	}

	@Override
	public List<OrderDTO> searchOrder(String keyword) {
		List<Order> orderList = search(keyword);

		return getOrderDTOList(orderList);
	}

	@Override
	public OrderDTO updateOrderStatus(OrderStatusUpdate orderStatusUpdate) {
		// get order from database
		Order order = new Order();
		order = getDetail(orderStatusUpdate.getOrderId());
		
		String orderStatus = getOrderStatus(orderStatusUpdate.getStatus());
		if (orderStatus == null) {
			throw new CustomException("Order status does not exist");
		}
		order.setOrderStatus(orderStatus);

		// update order
		Order orderNew = new Order();
		orderNew = update(order);
		
		return getOrderDTO(orderNew);
	}

	@Override
	public OrderDTO updateOrderPayment(OrderPaymentUpdate orderPaymentUpdate) {
		// get order from database
		Order order = new Order();
		order = getDetail(orderPaymentUpdate.getOrderId());
		
		// get payment
		if (order.getPayment() != null) {
			List<Payment> paymentList = new ArrayList<>(order.getPayment());
			
			// update payment
			Payment payment = new Payment();
			payment.setMethod(orderPaymentUpdate.getMethod());
			payment.setTransactionCode(orderPaymentUpdate.getTransactionCode());
			payment.setAmount(orderPaymentUpdate.getAmount());
			payment.setDate(orderPaymentUpdate.getDate());
			paymentList.add(payment);
			order.setPayment(paymentList);
		} else {
			List<Payment> paymentList = new ArrayList<>();
			
			// update payment
			Payment payment = new Payment();
			payment.setMethod(orderPaymentUpdate.getMethod());
			payment.setTransactionCode(orderPaymentUpdate.getTransactionCode());
			payment.setAmount(orderPaymentUpdate.getAmount());
			payment.setDate(orderPaymentUpdate.getDate());
			paymentList.add(payment);
			order.setPayment(paymentList);
		}
		
		// update order
		Order orderNew = new Order();
		orderNew = update(order);
		
		return getOrderDTO(orderNew);
	}
}
