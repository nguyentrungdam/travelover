package hcmute.kltn.Backend.model.hotel.service.impl;

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
import hcmute.kltn.Backend.model.hotel.dto.HotelCreate;
import hcmute.kltn.Backend.model.hotel.dto.HotelDTO;
import hcmute.kltn.Backend.model.hotel.dto.HotelSearch;
import hcmute.kltn.Backend.model.hotel.dto.HotelUpdate;
import hcmute.kltn.Backend.model.hotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.hotel.dto.entity.Hotel;
import hcmute.kltn.Backend.model.hotel.dto.extend.Room;
import hcmute.kltn.Backend.model.hotel.repository.HotelRepository;
import hcmute.kltn.Backend.model.hotel.service.IHotelService;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.service.IEHotelService;
import hcmute.kltn.Backend.util.LocalDateUtil;

@Service
public class HotelService implements IHotelService{
	@Autowired
	private HotelRepository hotelRepository;
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private IAccountDetailService iAccountDetailService;
	@Autowired
    private MongoTemplate mongoTemplate;
	@Autowired
	private IEHotelService iEHotelService;
	
	private String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Hotel.class);
        return collectionName;
    }
	
	private void checkFieldCondition(HotelDTO hotelDTO) {
		// check null
		if(hotelDTO.getHotelName() == null || hotelDTO.getHotelName().equals("")) {
			throw new CustomException("Hotel Name is not null");
		}
		if(hotelDTO.getContact() == null) {
			throw new CustomException("Contact is not null");
		}
		if(hotelDTO.getAddress() == null) {
			throw new CustomException("Address is not null");
		}
		
		// check unique
	}

	private Hotel create(HotelDTO hotelDTO) {
		// check field condition
		checkFieldCondition(hotelDTO);
		
		// mapping
		Hotel hotel = new Hotel();
		modelMapper.map(hotelDTO, hotel);
		
		// set default value
		String hotelId = iGeneratorSequenceService.genId(getCollectionName());
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		hotel.setHotelId(hotelId);
		hotel.setStatus(true);
		hotel.setCreatedBy(accountId);
		hotel.setCreatedAt(dateNow);
		hotel.setLastModifiedBy(accountId);
		hotel.setLastModifiedAt(dateNow);
		
		// create hotel
		hotel = hotelRepository.save(hotel);

		return hotel;
	}

	private Hotel update(HotelDTO hotelDTO) {
		// check exists
		if(!hotelRepository.existsById(hotelDTO.getHotelId())) {
			throw new CustomException("Cannot find hotel");
		}
		
		// check field condition
		checkFieldCondition(hotelDTO);
		
		// get hotel from database
		Hotel hotel = hotelRepository.findById(hotelDTO.getHotelId()).get();
		
		// mapping
		modelMapper.map(hotelDTO, hotel);
		
		// set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		hotel.setLastModifiedBy(accountId);
		hotel.setLastModifiedAt(dateNow);
		
		// update hotel
		hotel = hotelRepository.save(hotel);

		return hotel;
	}

	private Hotel getDetail(String hotelId) {
		// check exists
		if(!hotelRepository.existsById(hotelId)) {
			throw new CustomException("Cannot find hotel");
		}
		
		// get hotel from database
		Hotel hotel = hotelRepository.findById(hotelId).get();

		return hotel;
	}

	private List<Hotel> getAll() {
		// find all hotel
		List<Hotel> hotelList = hotelRepository.findAll();
		
		return hotelList;
	}

	private boolean delete(String hotelId) {
		// check exists
		if(!hotelRepository.existsById(hotelId)) {
			throw new CustomException("Cannot find hotel");
		}
		
		// delete hotel
		hotelRepository.deleteById(hotelId);

		return true;
	}
	
	private List<Hotel> search(String keyword) {
		// init hotel list
		List<Hotel> hotelList = new ArrayList<>();
		
		if(keyword == null || keyword.equals("")) {
			hotelList = getAll();
		} else {
			// create list field name
			List<Criteria> criteriaList = new ArrayList<>();
			for(Field itemField : Hotel.class.getDeclaredFields()) {
				if(itemField.getType() == String.class) {
					criteriaList.add(Criteria.where(itemField.getName()).regex(keyword, "i"));
				}
			}
			Criteria criteria = new Criteria();
			criteria.orOperator(criteriaList.toArray(new Criteria[0]));
			
			// create query
			Query query = new Query();
			query.addCriteria(criteria);
			
			// search
			hotelList = mongoTemplate.find(query, Hotel.class);
		}

		return hotelList;
	}

	@Override
	public Hotel createHotel(HotelCreate hotelCreate) {
		// mapping
		HotelDTO hotelDTO = new HotelDTO();
		modelMapper.map(hotelCreate, hotelDTO);
		
		// create hotel
		Hotel hotel = create(hotelDTO);
		
		return hotel;
	}

	@Override
	public Hotel updateHotel(HotelUpdate hotelUpdate) {
		// mapping 
		HotelDTO hotelDTO = new HotelDTO();
		modelMapper.map(hotelUpdate, hotelDTO);
		
		// update hotel
		Hotel hotel = update(hotelDTO);

		return hotel;
	}

	@Override
	public Hotel getDetailHotel(String hotelId) {
		// get hotel 
		Hotel hotel = getDetail(hotelId);

		return hotel;
	}

	@Override
	public List<Hotel> getAllHotel() {
		// get all hotel
		List<Hotel> hotelList = getAll();

		return hotelList;
	}

	@Override
	public List<Hotel> searchHotel(HotelSearch hotelSearch) {
		// search with keyword
		List<Hotel> hotelList = new ArrayList<>();
		List<Hotel> hotelListClone = new ArrayList<>();
		if(hotelSearch.getKeyword() != null) {
			hotelList = search(hotelSearch.getKeyword());
		} else {
			hotelList = getAll();
		}
		
		// search with province
		if(hotelSearch.getProvince() != null && !hotelSearch.getProvince().equals("")) {
			hotelListClone.clear();
			hotelListClone.addAll(hotelList);
			for(Hotel itemHotel : hotelListClone) {
				if(!itemHotel.getAddress().getProvince().equals(hotelSearch.getProvince())) {
					hotelList.remove(itemHotel);
					if(hotelList.size() == 0) {
						break;
					}
				}
			}
		}
		
		// search with district
		if(hotelSearch.getDistrict() != null && !hotelSearch.getDistrict().equals("")) {
			hotelListClone.clear();
			hotelListClone.addAll(hotelList);
			for(Hotel itemHotel : hotelListClone) {
				if(!itemHotel.getAddress().getDistrict().equals(hotelSearch.getDistrict())) {
					hotelList.remove(itemHotel);
					if(hotelList.size() == 0) {
						break;
					}
				}
			}
		}
		
		// search with commune
		if(hotelSearch.getCommune() != null && !hotelSearch.getCommune().equals("")) {
			hotelListClone.clear();
			hotelListClone.addAll(hotelList);
			for(Hotel itemHotel : hotelListClone) {
				if(!itemHotel.getAddress().getCommune().equals(hotelSearch.getCommune())) {
					hotelList.remove(itemHotel);
					if(hotelList.size() == 0) {
						break;
					}
				}
			}
		}

		return hotelList;
	}

	@Override
	public List<Room> searchRoom(RoomSearch roomSearch) {
		// mapping field in enterprise
		hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.RoomSearch roomSearchEnterprise = new hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.RoomSearch();
		modelMapper.map(roomSearch, roomSearchEnterprise);
		
		// search room in enterprise
		List<hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room> roomListEnterprise = new ArrayList<>();
		roomListEnterprise = iEHotelService.searchRoom(roomSearchEnterprise);
		
		// mapping room list
		List<Room> roomList = new ArrayList<>();
		for(hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room itemRoomEnterprise : roomListEnterprise) {
			Room room = new Room();
			modelMapper.map(itemRoomEnterprise, room);
			roomList.add(room);
		}
		
		return roomList;
	}

	@Override
	public Room getRoomDetail(String hotelId, String roomId) {
		Room room = new Room();
		
		hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.entity.EHotel eHotel = new hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.entity.EHotel();		
		eHotel = iEHotelService.getDetailEHotel(hotelId);
		for (hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room itemRoomEnterprise : eHotel.getRoom()) {
			if (itemRoomEnterprise.getRoomId().equals(roomId)) {
				room.setRoomId(itemRoomEnterprise.getRoomId());
				room.setCapacity(itemRoomEnterprise.getCapacity());
				room.setPrice(itemRoomEnterprise.getPrice());
				room.setStatus(itemRoomEnterprise.getStatus());
				
				break;
			}
		}
		return room;
	}

}
