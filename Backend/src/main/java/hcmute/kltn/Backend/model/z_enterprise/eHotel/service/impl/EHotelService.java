package hcmute.kltn.Backend.model.z_enterprise.eHotel.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
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
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room2;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.repository.EHotelRepository;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.service.IEHotelService;
import hcmute.kltn.Backend.util.IntegerUtil;
import hcmute.kltn.Backend.util.LocalDateTimeUtil;
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

    private String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(EHotel.class);
        return collectionName;
    }
    
    private void checkFieldCondition(EHotelDTO eHotelDTO) {
		// check null
		if(eHotelDTO.getEHotelName() == null || eHotelDTO.getEHotelName().equals("")) {
			throw new CustomException("Enterprise Hotel Name is not null");
		}
		if(eHotelDTO.getAddress() == null) {
			throw new CustomException("Address is not null");
		}
		if(eHotelDTO.getPhoneNumber() == null || eHotelDTO.getPhoneNumber().equals("")) {
			throw new CustomException("Phone number is not null");
		}
		if(eHotelDTO.getNumberOfStarRating() < 1 || eHotelDTO.getNumberOfStarRating() > 5) {
			throw new CustomException("Number Of Star Rating must be between 1 and 5");
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
//		for(Room itemRoom : eHotel.getRoom()) {
//			itemRoom.setRoomId(String.valueOf(eHotel.getRoom().indexOf(itemRoom) + 1));
//		}
		
		// set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		eHotel.setStatus(true);
		eHotel.setCreatedBy(accountId);
		eHotel.setCreatedAt(dateNow);
		eHotel.setLastModifiedBy(accountId);
		eHotel.setLastModifiedAt(dateNow);
		
		// new date
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();
		eHotel.setCreatedAt2(currentDate);
		eHotel.setLastModifiedAt2(currentDate);
		
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
		
		// new date
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();
		eHotel.setLastModifiedAt2(currentDate);
		
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
			criteriaList.add(Criteria.where("_id").is(keyword));

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
	
	private Room2 genRoom(String type, int rating) {
		Map<String, String> nameMap = new HashMap<>();
		nameMap.put("1", "Phòng tiêu chuẩn giường đơn");
		nameMap.put("2", "Phòng tiêu chuẩn giường đôi");
		nameMap.put("3", "Phòng tiện nghi giường đôi");
		nameMap.put("4", "Phòng rộng rãi giường đôi");
		nameMap.put("5", "Phòng tiêu chuẩn 2 giường đơn");
		nameMap.put("6", "Phòng tiêu chuẩn 2 giường");
		nameMap.put("7", "Phòng tiện nghi 2 giường");
		nameMap.put("8", "Phòng rộng rãi 2 giường");
		nameMap.put("9", "Phòng tiêu chuẩn 3 giường đơn");
		nameMap.put("10", "Phòng tiêu chuẩn gia đình");
		nameMap.put("11", "Phòng tiện nghi gia đình");
		nameMap.put("12", "Phòng rộng rãi gia đình");
		
		Map<String, List<String>> bedMap = new HashMap<>();
		bedMap.put("1", Arrays.asList("1 Giường đơn"));
		bedMap.put("2", Arrays.asList("1 Giường đôi"));
		bedMap.put("3", Arrays.asList("1 Giường đôi lớn"));
		bedMap.put("4", Arrays.asList("1 Giường lớn"));
		bedMap.put("5", Arrays.asList("2 Giường đơn"));
		bedMap.put("6", Arrays.asList("1 Giường đơn", "1 Giường đôi"));
		bedMap.put("7", Arrays.asList("1 Giường đơn", "1 Giường đôi lớn"));
		bedMap.put("8", Arrays.asList("1 Giường đơn", "1 Giường lớn"));
		bedMap.put("9", Arrays.asList("3 Giường đơn"));
		bedMap.put("10", Arrays.asList("2 Giường đôi"));
		bedMap.put("11", Arrays.asList("2 Giường đôi lớn"));
		bedMap.put("12", Arrays.asList("2 Giường lớn"));
		
		Map<String, Integer> standardNumberOfAdultMap = new HashMap<>();
		standardNumberOfAdultMap.put("1", 1);
		standardNumberOfAdultMap.put("2", 2);
		standardNumberOfAdultMap.put("3", 2);
		standardNumberOfAdultMap.put("4", 2);
		standardNumberOfAdultMap.put("5", 2);
		standardNumberOfAdultMap.put("6", 3);
		standardNumberOfAdultMap.put("7", 3);
		standardNumberOfAdultMap.put("8", 3);
		standardNumberOfAdultMap.put("9", 3);
		standardNumberOfAdultMap.put("10", 4);
		standardNumberOfAdultMap.put("11", 4);
		standardNumberOfAdultMap.put("12", 4);
		
		Map<String, Integer> maximumNumberOfChildrenMap = new HashMap<>();
		maximumNumberOfChildrenMap.put("1", 1);
		maximumNumberOfChildrenMap.put("2", 2);
		maximumNumberOfChildrenMap.put("3", 2);
		maximumNumberOfChildrenMap.put("4", 2);
		maximumNumberOfChildrenMap.put("5", 2);
		maximumNumberOfChildrenMap.put("6", 3);
		maximumNumberOfChildrenMap.put("7", 3);
		maximumNumberOfChildrenMap.put("8", 3);
		maximumNumberOfChildrenMap.put("9", 3);
		maximumNumberOfChildrenMap.put("10", 4);
		maximumNumberOfChildrenMap.put("11", 4);
		maximumNumberOfChildrenMap.put("12", 4);
		
		Map<String, String> actualNumberOfAdultMap = new HashMap<>();
		actualNumberOfAdultMap.put("1", "1-1");
		actualNumberOfAdultMap.put("2", "1-2");
		actualNumberOfAdultMap.put("3", "1-2");
		actualNumberOfAdultMap.put("4", "1-2");
		actualNumberOfAdultMap.put("5", "2-3");
		actualNumberOfAdultMap.put("6", "2-4");
		actualNumberOfAdultMap.put("7", "2-4");
		actualNumberOfAdultMap.put("8", "2-4");
		actualNumberOfAdultMap.put("9", "3-5");
		actualNumberOfAdultMap.put("10", "3-5");
		actualNumberOfAdultMap.put("11", "3-5");
		actualNumberOfAdultMap.put("12", "3-5");
		
		Map<Integer, Integer> priceRandomMap = new HashMap<>();
		priceRandomMap.put(1, IntegerUtil.randomRange(-50, 50) * 1000);
		priceRandomMap.put(2, IntegerUtil.randomRange(-100, 100) * 1000);
		priceRandomMap.put(3, IntegerUtil.randomRange(-200, 200) * 1000);
		priceRandomMap.put(4, IntegerUtil.randomRange(-300, 300) * 1000);
		priceRandomMap.put(5, IntegerUtil.randomRange(-400, 400) * 1000);
		
		Map<String, Integer> priceMap = new HashMap<>();
		priceMap.put("1", 200000 * rating + priceRandomMap.get(rating));
		priceMap.put("2", 300000 * rating + priceRandomMap.get(rating));
		priceMap.put("3", 400000 * rating + priceRandomMap.get(rating));
		priceMap.put("4", 500000 * rating + priceRandomMap.get(rating));
		priceMap.put("5", 600000 * rating + priceRandomMap.get(rating));
		priceMap.put("6", 700000 * rating + priceRandomMap.get(rating));
		priceMap.put("7", 800000 * rating + priceRandomMap.get(rating));
		priceMap.put("8", 900000 * rating + priceRandomMap.get(rating));
		priceMap.put("9", 1000000 * rating + priceRandomMap.get(rating));
		priceMap.put("10", 1100000 * rating + priceRandomMap.get(rating));
		priceMap.put("11", 1200000 * rating + priceRandomMap.get(rating));
		priceMap.put("12", 1300000 * rating + priceRandomMap.get(rating));
		
		Room2 room = new Room2();
		room.setName(nameMap.get(type));
		room.setBed(bedMap.get(type));
		room.setStandardNumberOfAdult(standardNumberOfAdultMap.get(type));
		room.setMaximumNumberOfChildren(maximumNumberOfChildrenMap.get(type));
		room.setActualNumberOfAdult(actualNumberOfAdultMap.get(type));
		room.setPrice(priceMap.get(type));
		room.setStatus(true);
		
		return room;
	}
	
	@Override
	public EHotel createEHotel(EHotelCreate eHotelCreate) {
		// mapping hotelDTO
		EHotelDTO eHotelDTO = new EHotelDTO();
		modelMapper.map(eHotelCreate, eHotelDTO);
		
		List<Room2> roomList = new ArrayList<>();
		int index = 1;
		for (int type = 1; type <= 12; type++) {
			Room2 room2 = new Room2();
			room2 = genRoom(String.valueOf(type), eHotelCreate.getNumberOfStarRating());
			
			for (int rating = 1; rating <= (eHotelCreate.getNumberOfStarRating() * 2); rating++) {
				Room2 room = new Room2();
				modelMapper.map(room2, room);
				room.setRoomId(String.valueOf(index));
				roomList.add(room);
				index++;
			}
		}
		eHotelDTO.setRoom2(roomList);
		
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
		// 1. Chia số người lớn theo số phòng = A
		// 2. Tìm phòng chứa được A hoặc phòng to nhất chứa được A
		// 3. Nếu còn dư người, tìm 1 phòng chứa đủ người còn dư hoặc phòng to nhất chứa đủ người còn dư
		// 4. nếu còn dư người, lặp lại bước 3
		
		// check number of adult than number of room
		if (roomSearch.getNumberOfAdult() < roomSearch.getNumberOfRoom()) {
			throw new CustomException("The number of adults must be greater than or equal to the number of rooms");
		}
		
		// get hotel from db
		EHotel eHotel = getDetail(roomSearch.getEHotelId());
		
		// get all room with hotelId from db
		List<Room> roomList = eHotel.getRoom();
		List<Room> roomListClone = new ArrayList<>();
		
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
			
			// search with startDate
			roomListClone.clear();
			roomListClone.addAll(roomList);
			for(Room itemRoom : roomListClone) {
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
		
		// sort roomList by capacity asc
		Collections.sort(roomList, new Comparator<Room>() {
            @Override
            public int compare(Room e1, Room e2) {
            	int result = 0;
            	result = Integer.compare(e1.getCapacity(), e2.getCapacity());
                return result;
            }
        });

		// search with numberOfPeople
		List<Room> roomListResult = new ArrayList<>();
		int numberOfPeople = 0;
		numberOfPeople = roomSearch.getNumberOfAdult();
		int currentCaptity = 0;
		int numberOfPeoplePerRoom = 0;
		
		// Find with number of room
		numberOfPeoplePerRoom = roomSearch.getNumberOfAdult() / roomSearch.getNumberOfRoom();
		for (int i = 0; i < roomSearch.getNumberOfRoom(); i++) {
			Room roomMaxCapacity = new Room();
			roomMaxCapacity.setCapacity(0);
			roomListClone.clear();
			roomListClone.addAll(roomList);
			for (Room itemRoom : roomListClone) {
				if (itemRoom.getCapacity() >= numberOfPeoplePerRoom) {
					currentCaptity += itemRoom.getCapacity();
					roomListResult.add(itemRoom);
					roomList.remove(itemRoom);
					roomMaxCapacity.setCapacity(0);
					break;
				}
				if (roomMaxCapacity.getCapacity() < itemRoom.getCapacity()) {
					modelMapper.map(itemRoom, roomMaxCapacity);
				}
			}
			if (roomMaxCapacity.getCapacity() > 0) {
				currentCaptity += roomMaxCapacity.getCapacity();
				roomListResult.add(roomMaxCapacity);
				roomList.remove(roomMaxCapacity);
			}
		}
		
		// Continue find if there are more people left
		while (currentCaptity < numberOfPeople) {
			if(roomList.size() == 0) {
				throw new CustomException("There are not enough available rooms");
			}
			
			Room roomMaxCapacity = new Room();
			roomMaxCapacity.setCapacity(0);
			roomListClone.clear();
			roomListClone.addAll(roomList);
			for (Room itemRoom : roomListClone) {
				if (itemRoom.getCapacity() >= numberOfPeople) {
					currentCaptity += itemRoom.getCapacity();
					roomListResult.add(itemRoom);
					roomList.remove(itemRoom);
					roomMaxCapacity.setCapacity(0);
					break;
				}
				if (roomMaxCapacity.getCapacity() < itemRoom.getCapacity()) {
					modelMapper.map(itemRoom, roomMaxCapacity);
				}
			}
			if (roomMaxCapacity.getCapacity() > 0) {
				currentCaptity += roomMaxCapacity.getCapacity();
				roomListResult.add(roomMaxCapacity);
				roomList.remove(roomMaxCapacity);
			}
		}

		return roomListResult;
	}

	@Override
	public List<Room2> searchRoom2(RoomSearch roomSearch) {
		
		return null;
	}
}
