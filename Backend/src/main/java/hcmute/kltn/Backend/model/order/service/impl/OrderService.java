package hcmute.kltn.Backend.model.order.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.dto.entity.Account;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.base.EOrderStatus;
import hcmute.kltn.Backend.model.discount.dto.DiscountDTO;
import hcmute.kltn.Backend.model.discount.dto.DiscountUpdate;
import hcmute.kltn.Backend.model.discount.service.IDiscountService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.model.hotel.dto.HotelDTO;
import hcmute.kltn.Backend.model.hotel.dto.extend.Room;
import hcmute.kltn.Backend.model.hotel.service.IHotelService;
import hcmute.kltn.Backend.model.order.dto.OrderCreate;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;
import hcmute.kltn.Backend.model.order.dto.OrderPaymentUpdate;
import hcmute.kltn.Backend.model.order.dto.OrderStatusUpdate;
import hcmute.kltn.Backend.model.order.dto.OrderUpdate;
import hcmute.kltn.Backend.model.order.dto.entity.Order;
import hcmute.kltn.Backend.model.order.dto.extend.CustomerInformation;
import hcmute.kltn.Backend.model.order.dto.extend.Discount;
import hcmute.kltn.Backend.model.order.dto.extend.HotelDetail;
import hcmute.kltn.Backend.model.order.dto.extend.Member;
import hcmute.kltn.Backend.model.order.dto.extend.OrderDetail;
import hcmute.kltn.Backend.model.order.dto.extend.Payment;
import hcmute.kltn.Backend.model.order.dto.extend.VOTourDetail;
import hcmute.kltn.Backend.model.order.repository.OrderRepository;
import hcmute.kltn.Backend.model.order.service.IOrderService;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
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
	@Autowired
	private IDiscountService iDiscountService;
	
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
	
	private List<Order> hideOrderUnpaid(List<Order> orderList) {
		List<Order> orderListClone = new ArrayList<>();
		orderListClone.addAll(orderList);
		
		if (orderListClone != null) {
			for (Order itemOrder : orderListClone) {
				if (itemOrder.getOrderStatus() != null) {
					if (itemOrder.getOrderStatus().equals("create")) {
						orderList.remove(itemOrder);
						if (orderList.size() <= 0) {
							break;
						}
					}
				}
			}
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
	
	private void defaultSort(List<Order> orderList) {
		Collections.sort(orderList, new Comparator<Order>() {
            @Override
            public int compare(Order order1, Order order2) {
            	int result = order2.getLastModifiedAt().compareTo(order1.getLastModifiedAt());

                return result;
            }
        });
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
		vOTourDetail.setNumberOfDay(tourDTO.getNumberOfDay());
		vOTourDetail.setNumberOfNight(tourDTO.getNumberOfNight());
		vOTourDetail.setPriceOfAdult(tourDTO.getPriceOfAdult());
		vOTourDetail.setPriceOfChildren(tourDTO.getPriceOfChildren());
		
		orderDetail.setTourDetail(vOTourDetail);
		
		// update total price
		totalPrice += vOTourDetail.getPriceOfAdult() * orderCreate.getNumberOfAdult();
		totalPrice += vOTourDetail.getPriceOfChildren() * orderCreate.getNumberOfChildren();
		
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
			totalPrice += hotelDetail.getPrice() * vOTourDetail.getNumberOfDay();
		}
		
		orderDetail.setHotelDetail(hotelDetailList);
		
		// get vehicle information
		
		// get guider information
		
		order.setTotalPrice(totalPrice);
		
		// update discount
		Discount discount = new Discount();
		discount.setDiscountTour(null);
		discount.setDiscountTourValue(0);
		discount.setDiscountCode(null);
		discount.setDiscountCodeValue(0);
		// discount tour
		if (tourDTO.getDiscount().getIsDiscount() == true) {
			int actualDiscountValue = totalPrice * tourDTO.getDiscount().getDiscountValue() / 100;
			totalPrice = totalPrice - actualDiscountValue;
			discount.setDiscountTour(tourDTO.getTourId());
			discount.setDiscountTourValue(actualDiscountValue);
		}
		// discount add
		if (orderCreate.getDiscountCode() != null && !orderCreate.getDiscountCode().equals("")) {
			int actualDiscountValue = iDiscountService.getActualDiscountValue(orderCreate.getDiscountCode(), totalPrice);
			
			totalPrice = totalPrice - actualDiscountValue;
			discount.setDiscountCode(orderCreate.getDiscountCode());
			discount.setDiscountCodeValue(actualDiscountValue);
		}

		order.setDiscount(discount);
		order.setOrderDetail(orderDetail);
		order.setFinalPrice(totalPrice);
		order.setOrderStatus("create");
//		order.setOrderStatus(getOrderStatus("1"));
		
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
		
		if (order.getOrderStatus() != null) {
			if (order.getOrderStatus().equals("create")) {
				throw new CustomException("Cannot find order");
			}
		}

		return getOrderDTO(order);
	}

	@Override
	public List<OrderDTO> getAllOrder() {
		List<Order> orderList = new ArrayList<>(getAll());
		defaultSort(orderList);
		
		Account currentAccount = iAccountDetailService.getCurrentAccount();
		if (currentAccount.getRole().equals("CUSTOMER")) {
			List<Order> orderListClone = new ArrayList<>(getAll());
			for (Order itemOrder : orderListClone) {
				if (!itemOrder.getCreatedBy().equals(currentAccount.getAccountId())) {
					orderList.remove(itemOrder);
					if (orderList.size() <= 0) {
						break;
					}
				}
			}
		}

		return getOrderDTOList(hideOrderUnpaid(orderList));
	}

	@Override
	public List<OrderDTO> searchOrder(String keyword) {
		List<Order> orderList = search(keyword);

		return getOrderDTOList(hideOrderUnpaid(orderList));
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
		
		// check cancel status
		if (order.getOrderStatus().equals("canceled")) {
			throw new CustomException("Can't update status for canceled orders");
		}
		// check finished status
				if (order.getOrderStatus().equals("finished")) {
					throw new CustomException("Can't update status for finished orders");
				}
		// check follow status
		int orderStatusOld = 0;
		if (!orderStatus.equals("canceled")) {
			for (EOrderStatus value : EOrderStatus.values()) {
				if (order.getOrderStatus().equals(String.valueOf(value))) {
					break;
				}
				orderStatusOld += 1;
			}
			int orderStatusNew = 0;
			for (EOrderStatus value : EOrderStatus.values()) {
				if (orderStatus.equals(String.valueOf(value))) {
					break;
				}
				orderStatusNew += 1;
			}
			if (orderStatusNew <= orderStatusOld) {
				throw new CustomException("Order status update failed, the new status must be greater than the current status");
			}
		}
		
		// update tour numberOfOrdered
		if (orderStatus.equals("finished")) {
			iTourService.updateNumberOfOrdered(order.getOrderDetail().getTourId());
		}

		order.setOrderStatus(orderStatus);
		
		// set last modify
		LocalDate today = LocalDateUtil.getDateNow();
		Account account = iAccountDetailService.getCurrentAccount();
		order.setLastModifiedBy(account.getAccountId());
		order.setLastModifiedAt(today);

		// update order
		Order orderNew = new Order();
		orderNew = orderRepository.save(order);
		
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
		
		if (order.getDiscount().getDiscountCode() != null && !order.getDiscount().getDiscountCode().equals("")) {
			// update number of code used in discount
			DiscountDTO discountDTO = new DiscountDTO();
			discountDTO = iDiscountService.getDiscountByCode(order.getDiscount().getDiscountCode());
			if (discountDTO.getIsQuantityLimit() == true) {
				iDiscountService.usedDiscount(order.getDiscount().getDiscountCode());
			}
		}
		
		// update orderStatus
		order.setOrderStatus(getOrderStatus("1"));
		
		// update order
		Order orderNew = new Order();
		orderNew = orderRepository.save(order);
		
		return getOrderDTO(orderNew);
	}

	@Override
	public boolean paymentCheck(String orderId) {
		Order order = new Order();
		order = getDetail(orderId);
		
		if (order.getPayment() != null) {
			if (order.getPayment().size() > 0) {
				return true;
			}
		}
		
		return false;
	}

	@Override
	public void deleteUnpaidOrder() {
		// get current date
		LocalDate currentDate = LocalDateUtil.getDateNow();
		
		// get all order
		List<Order> orderList = new ArrayList<>();
		orderList.addAll(getAll());
		
		// delete order unPaid
		if (orderList != null) {
			for (Order itemOrder : orderList) {
				if (itemOrder.getOrderStatus() != null) {
					if (itemOrder.getOrderStatus().equals("create")) {
						if (itemOrder.getCreatedAt().isBefore(currentDate)) {
							orderRepository.delete(itemOrder);
						}
					}
				} else {
					orderRepository.delete(itemOrder);
				}	
			}
		}
		System.out.println("Delete Unpaid Order Successfully");
	}
}
