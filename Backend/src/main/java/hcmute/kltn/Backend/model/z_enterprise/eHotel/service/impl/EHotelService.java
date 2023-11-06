package hcmute.kltn.Backend.model.z_enterprise.eHotel.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelDTO;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.entity.EHotel;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Order;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.OrderDetail;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.repository.EHotelRepository;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.service.IEHotelService;
import hcmute.kltn.Backend.util.LocalDateUtil;

@Service
public class EHotelService implements IEHotelService{
	@Autowired
	private EHotelRepository eHotelRepository;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private IAccountDetailService iAccountDetailService;
	@Autowired
    private MongoTemplate mongoTemplate;

    public String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(EHotel.class);
        return collectionName;
    }
    
    private void checkFieldCondition(EHotelDTO eHotelDTO) {
		// check null
		if(eHotelDTO.getEHotelName() == null || eHotelDTO.getEHotelName().equals("")) {
			throw new CustomException("Enterprise Hotel Name is not null");
		}
		if(eHotelDTO.getRoom() == null) {
			throw new CustomException("Room is not null");
		}
		
		// check unique
	}

	private EHotel create(EHotelDTO eHotelDTO) {
		// check field condition
		checkFieldCondition(eHotelDTO);
		
		// mapping
		EHotel eHotel = new EHotel();
		modelMapper.map(eHotelDTO, eHotel);
		
		// set roomId
		for(Room itemRoom : eHotel.getRoom()) {
			itemRoom.setRoomId(String.valueOf(eHotel.getRoom().indexOf(itemRoom) + 1));
		}
		
		// set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		eHotel.setStatus(true);
		eHotel.setCreatedBy(accountId);
		eHotel.setCreatedAt(dateNow);
		eHotel.setLastModifiedBy(accountId);
		eHotel.setLastModifiedAt(dateNow);
		
		// create hotel
		eHotel = eHotelRepository.save(eHotel);
		
		return eHotel;
	}

	private EHotel update(EHotelDTO eHotelDTO) {
		// check exists
		if(!eHotelRepository.existsById(eHotelDTO.getEHotelId())) {
			throw new CustomException("Cannot find enterprise hotel");
		}
		
		// check field condition
		checkFieldCondition(eHotelDTO);
		
		// get hotel from db
		EHotel eHotel = eHotelRepository.findById(eHotelDTO.getEHotelId()).get();
		
		// mapping
		modelMapper.map(eHotelDTO, eHotel);
		
		// set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		eHotel.setLastModifiedBy(accountId);
		eHotel.setLastModifiedAt(dateNow);
		
		// update hotel
		eHotel = eHotelRepository.save(eHotel);

		return eHotel;
	}

	private EHotel getDetail(String eHotelId) {
		// check exists
		if(!eHotelRepository.existsById(eHotelId)) {
			throw new CustomException("Cannot find enterprise hotel");
		}
		
		// get hotel from db
		EHotel eHotel = eHotelRepository.findById(eHotelId).get();
		
		return eHotel;
	}

	private List<EHotel> getAll() {
		// get all hotel from db
		List<EHotel> eHotelList = eHotelRepository.findAll();

		return eHotelList;
	}

	private boolean delete(String eHotelId) {
		// check exists
		if(!eHotelRepository.existsById(eHotelId)) {
			throw new CustomException("Cannot find enterprise hotel");
		}
		
		// delete hotel
		eHotelRepository.deleteById(eHotelId);
		
		return true;
	}
	
	private List<EHotel> search(String keyword) {
		// init EHotel List
		List<EHotel> eHotelList = new ArrayList<>();
		
		if(keyword == null || keyword.equals("")) {
			eHotelList = getAll();
		} else {
			// create list field name
			List<Criteria> criteriaList = new ArrayList<>();
			for(Field itemField : EHotel.class.getDeclaredFields()) {
				 if (itemField.getType() == String.class) {
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
	        eHotelList = mongoTemplate.find(query, EHotel.class);
		}

		return eHotelList;
	}
	
	@Override
	public EHotel createEHotel(EHotelCreate eHotelCreate) {
		// mapping hotelDTO
		EHotelDTO eHotelDTO = new EHotelDTO();
		modelMapper.map(eHotelCreate, eHotelDTO);
		
		// create hotel
		EHotel eHotel = create(eHotelDTO);

		return eHotel;
	}

	@Override
	public EHotel updateEHotel(EHotelUpdate eHotelUpdate) {
		// mapping DTO
		EHotelDTO eHotelDTO = new EHotelDTO();
		modelMapper.map(eHotelUpdate, eHotelDTO);
		
		// update hotel
		EHotel eHotel = update(eHotelDTO);

		return eHotel;
	}
	
	@Override
	public EHotel getDetailEHotel(String eHotelId) {
		EHotel eHotel = getDetail(eHotelId);
		
		return eHotel;
	}

	@Override
	public List<EHotel> getAllEHotel() {
		List<EHotel> eHotelList = getAll();

		return eHotelList;
	}
	
	@Override
	public List<EHotel> searchEHotel(String keyword) {
		List<EHotel> eHotelList = search(keyword);

		return eHotelList;
	}

	@Override
	public Order createOrder(EHotelOrderCreate eHotelOrder) {
		// get order from db with hotel
		EHotel eHotel = getDetail(eHotelOrder.getEHotelId());
		List<Order> orderList = eHotel.getOrder();
		
		Order order = new Order();
		modelMapper.map(eHotelOrder, order);
		
		// insert order detail into order
		List<OrderDetail> orderDetailList = new ArrayList();
		OrderDetail orderDetail = new OrderDetail();
		for(String itemRoomId : eHotelOrder.getRoomId()) {
			for(Room itemRoom : eHotel.getRoom()) {
				if(itemRoomId.equals(itemRoom.getRoomId())) {
					orderDetail.setRoomId(itemRoom.getRoomId());
					orderDetail.setCapacity(itemRoom.getCapacity());
					orderDetail.setPrice(itemRoom.getPrice());
					orderDetailList.add(orderDetail);
					break;
				}
			}
			if(itemRoomId != orderDetail.getRoomId()) {
				throw new CustomException("Cannot find room id " + itemRoomId);
			}
		}
		order.setOrderDetail(orderDetailList);
		
		// set default value
		int indexOrderList = orderList.size() + 1;
		order.setOrderId(String.valueOf(indexOrderList));
		int totalPrice = 0;
		for(OrderDetail itemOrderDetail : order.getOrderDetail()) {
			totalPrice += itemOrderDetail.getPrice();
		}
		order.setTotalPrice(totalPrice);
		
		// create order
		orderList.add(order);
		eHotel.setOrder(orderList);
		eHotelRepository.save(eHotel);

		return order;
	}

	@Override
	public Order updateOrder(EHotelOrderUpdate eHotelOrderUpdate) {
		// get hotel from data
		EHotel eHotel = getDetail(eHotelOrderUpdate.getEHotelId());
		
		// check exists order
		boolean checkOrder = false;
		for(Order itemOrder : eHotel.getOrder()) {
			if(itemOrder.getOrderId().equals(eHotelOrderUpdate.getOrderId())) {
				checkOrder = true;
				break;
			}
		}
		if(!checkOrder) {
			throw new CustomException("Cannot find order");
		}
		
		// mapping
		Order order = new Order();
		modelMapper.map(eHotelOrderUpdate, order);
		
		// set default value
		int totalPrice = 0;
		for(OrderDetail itemOrderDetail : order.getOrderDetail()) {
			totalPrice += itemOrderDetail.getPrice();
		}
		order.setTotalPrice(totalPrice);
		
		// update order
		List<Order> orderList = eHotel.getOrder();
		for(Order itemOrder : eHotel.getOrder()) {
			if(itemOrder.getOrderId().equals(eHotelOrderUpdate.getOrderId())) {
				orderList.set(eHotel.getOrder().indexOf(itemOrder), order);
				break;
			}
		}
		eHotel.setOrder(orderList);
		eHotelRepository.save(eHotel);

		return null;
	}

	@Override
	public Order getOneOrder(String eHotelId, String orderId) {
		// get hotel from data
		EHotel eHotel = getDetail(eHotelId);
		
		// check exists order
		boolean checkOrder = false;
		for(Order itemOrder : eHotel.getOrder()) {
			if(itemOrder.getOrderId().equals(orderId)) {
				checkOrder = true;
				break;
			}
		}
		if(!checkOrder) {
			throw new CustomException("Cannot find order");
		}
		
		// get order
		Order order = new Order();
		for(Order itemOrder : eHotel.getOrder()) {
			if(itemOrder.getOrderId().equals(orderId)) {
				order = itemOrder;
				break;
			}
		}
		return order;
	}

	@Override
	public List<Order> getAllOrder(String eHotelId) {
		// get hotel
		EHotel eHotel = getDetail(eHotelId);
		
		return eHotel.getOrder();
	}

	

	@Override
	public List<Room> searchRoom(RoomSearch roomSearch) {
		// get hotel from db
		EHotel eHotel = getDetail(roomSearch.getEHotelId());
		
		// get all room with hotelId from db
		List<Room> roomList = eHotel.getRoom();
		
		// check order
		if(eHotel.getOrder() != null) {
			// get all Order with startDate and endDate
			List<Order> orderList = new ArrayList<>();
			for(Order itemOrder : eHotel.getOrder()) {
				if((itemOrder.getStartDate().isBefore(roomSearch.getEndDate()) || itemOrder.getStartDate().isEqual(roomSearch.getEndDate())) 
						&& (itemOrder.getEndDate().isAfter(roomSearch.getStartDate()) || itemOrder.getEndDate().isEqual(roomSearch.getStartDate()))) {
					orderList.add(itemOrder);
				}
			}
			
			// get all roomId with startDate and endDate
			List<String> roomIdList = new ArrayList<>();
			for(Order itemOrder : orderList) {
				for(OrderDetail itemOrderDetail : itemOrder.getOrderDetail()) {
					roomIdList.add(itemOrderDetail.getRoomId());
				}
			}
			
			// search with startDate and numberOfPeople
			for(Room itemRoom : roomList) {
				for(String itemRoomId : roomIdList) {
					if(itemRoomId.equals(itemRoom.getRoomId())) {
						roomList.remove(itemRoom);
						break;
					}
				}
				if(roomList.size() == 0) {
					break;
				}
			}
		}

		// search with numberOfPeople
		int totalCaptity = 0;
		List<Room> roomListBackup = new ArrayList<>(roomList);
		for(Room itemRoom : roomListBackup) {
			if(totalCaptity >= roomSearch.getNumberOfPeople()) {
				roomList.remove(itemRoom);
			}
			
			totalCaptity += itemRoom.getCapacity();
		}

		return roomList;
	}
}
