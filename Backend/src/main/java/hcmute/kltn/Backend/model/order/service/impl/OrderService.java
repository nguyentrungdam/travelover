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
import hcmute.kltn.Backend.model.hotel.dto.entity.Hotel;
import hcmute.kltn.Backend.model.hotel.dto.extend.Room;
import hcmute.kltn.Backend.model.hotel.service.IHotelService;
import hcmute.kltn.Backend.model.order.dto.OrderCreate;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;
import hcmute.kltn.Backend.model.order.dto.OrderStatusUpdate;
import hcmute.kltn.Backend.model.order.dto.OrderUpdate;
import hcmute.kltn.Backend.model.order.dto.entity.Order;
import hcmute.kltn.Backend.model.order.dto.extend.HotelDetail;
import hcmute.kltn.Backend.model.order.dto.extend.OrderDetail;
import hcmute.kltn.Backend.model.order.dto.extend.VOTourDetail;
import hcmute.kltn.Backend.model.order.repository.OrderRepository;
import hcmute.kltn.Backend.model.order.service.IOrderService;
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
	
	private String getOrderStatus(int index) {
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
    
    private void checkFieldCondition(OrderDTO orderDTO) {
		// check null
		LocalDate dateNow = LocalDateUtil.getDateNow();
		if(orderDTO.getStartDate() == null || orderDTO.getStartDate().isEqual(dateNow) || orderDTO.getStartDate().isBefore(dateNow)) {
			throw new CustomException("The start date must greater than the current date");
		}
		if(orderDTO.getEndDate() == null || orderDTO.getEndDate().isEqual(dateNow) 
				|| orderDTO.getEndDate().isBefore(dateNow) || orderDTO.getEndDate().isBefore(orderDTO.getStartDate())) {
			throw new CustomException("The end date must greater or equal than the start date");
		}
		if(orderDTO.getCustomerInformation() == null) {
			throw new CustomException("Customer Information is not null");
		}
		if(orderDTO.getNumberOfChildren() < 0) {
			throw new CustomException("Number of children must greater or equal than 0");
		}
		if(orderDTO.getNumberOfAdult() <= 0) {
			throw new CustomException("Number of adult must greate than 0");
		}
//		if(orderDTO.getPrice() <= 0) {
//			throw new CustomException("Price must greate than 0");
//		}
		if(orderDTO.getTotalPrice() <= 0) {
			throw new CustomException("Total price must greate than 0");
		}
		
		// check unique
	}

	private Order create(OrderDTO orderDTO) {
		// check field condition
		checkFieldCondition(orderDTO);
		
		// mapping
		Order order = new Order();
		modelMapper.map(orderDTO, order);
		
		// set default value
		String orderId = iGeneratorSequenceService.genId(getCollectionName());
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		order.setOrderId(orderId);
		order.setOrderStatus(getOrderStatus(1));
		order.setStatus(true);
		order.setCreatedBy(accountId);
		order.setCreatedAt(dateNow);
		order.setLastModifiedBy(accountId);
		order.setLastModifiedAt(dateNow);
		
		// create order
		order = orderRepository.save(order);
		
		return order;
	}

	private Order update(OrderDTO orderDTO) {
		// check exists
		if(!orderRepository.existsById(orderDTO.getOrderId())) {
			throw new CustomException("Cannot find order");
		}
		
		// check field condition
		checkFieldCondition(orderDTO);
		
		// get order from db
		Order order = orderRepository.findById(orderDTO.getOrderId()).get();
		
		// mapping
		modelMapper.map(orderDTO, order);
		
		// set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		String orderStatus = getOrderStatus(orderDTO.getOrderStatus());
		if (orderStatus == null) {
			throw new CustomException("Order status does not exist");
		}
		order.setOrderStatus(orderStatus);
		order.setLastModifiedBy(accountId);
		order.setLastModifiedAt(dateNow);
		
		// update order
		order = orderRepository.save(order);

		return order;
	}

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

	private boolean delete(String orderId) {
		// TODO Auto-generated method stub
		return false;
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

	

	@Override
	public Order createOrder(OrderCreate orderCreate) {
		int totalPrice = 0;
		
		// mapping orderDto
		OrderDTO orderDTO = new OrderDTO();
		modelMapper.map(orderCreate, orderDTO);
		
		// init order detail
		OrderDetail orderDetail = new OrderDetail();
		
		// get tour information
		orderDetail.setTourId(orderCreate.getTourId());
		
		Tour tour = new Tour();
		tour = iTourService.getDetailTour(orderCreate.getTourId());
		VOTourDetail vOTourDetail = new VOTourDetail();
		vOTourDetail.setTourTitle(tour.getTourTitle());
		vOTourDetail.setThumbnailUrl(tour.getThumbnailUrl());
		vOTourDetail.setPrice(tour.getPrice());
		
		orderDetail.setTourDetail(vOTourDetail);
		
		// update total price
		totalPrice += vOTourDetail.getPrice();

		// get hotel information
		List<HotelDetail> hotelDetailList = new ArrayList<>();
		orderDetail.setHotelId(orderCreate.getHotelId());
		Hotel hotel = new Hotel();
		hotel = iHotelService.getDetailHotel(orderCreate.getHotelId());
		for (String itemString : orderCreate.getRoomIdList()) {
			Room room = new Room();
			room = iHotelService.getRoomDetail(hotel.getEHotelId(), itemString);
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
		
		orderDTO.setOrderDetail(orderDetail);
		orderDTO.setTotalPrice(totalPrice);
		
		// create order
		Order order = new Order();
		order = create(orderDTO);

		return order;
	}

	@Override
	public Order updateOrder(OrderUpdate orderUpdate) {
		// mapping orderDTO
		OrderDTO orderDTO = new OrderDTO();
		modelMapper.map(orderUpdate, orderDTO);
		
		// update order
		Order order = new Order();
		order = update(orderDTO);

		return order;
	}

	@Override
	public Order getDetailOrder(String orderId) {
		Order order = getDetail(orderId);

		return order;
	}

	@Override
	public List<Order> getAllOrder() {
		List<Order> orderList = getAll();

		return orderList;
	}

	@Override
	public List<Order> searchOrder(String keyword) {
		List<Order> orderList = search(keyword);

		return orderList;
	}

	@Override
	public Order updateOrderStatus(OrderStatusUpdate orderStatusUpdate) {
		// get order from database
		Order order = new Order();
		order = getDetail(orderStatusUpdate.getOrderId());
		
		// get order dto
		OrderDTO orderDTO = new OrderDTO();
		modelMapper.map(order, orderDTO);
		
		// update order status
		orderDTO.setOrderStatus(orderStatusUpdate.getStatus());

		// update order
		order = update(orderDTO);
		
		return order;
	}
}
