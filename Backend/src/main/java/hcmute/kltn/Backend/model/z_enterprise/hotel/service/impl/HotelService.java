package hcmute.kltn.Backend.model.z_enterprise.hotel.service.impl;

import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.HotelDTO;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.entity.Hotel;
import hcmute.kltn.Backend.model.z_enterprise.hotel.repository.HotelRepository;
import hcmute.kltn.Backend.model.z_enterprise.hotel.service.IHotelService;
import hcmute.kltn.Backend.util.DateUtil;

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

    public String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Hotel.class);
        return collectionName;
    }

	@Override
	public Hotel create(HotelDTO hotelDTO) {
		// check field condition
		checkFieldCondition(hotelDTO);
		
		// mapping
		Hotel hotel = new Hotel();
		modelMapper.map(hotelDTO, hotel);
		
		// set default value
		String hotelId = iGeneratorSequenceService.genId(getCollectionName());
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		Date dateNow = DateUtil.getDateNow();
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

	@Override
	public Hotel update(HotelDTO hotelDTO) {
		// check exists
		if(!hotelRepository.existsById(hotelDTO.getHotelId())) {
			throw new CustomException("Cannot find hotel");
		}
		
		// check field condition
		checkFieldCondition(hotelDTO);
		
		// get hotel from db
		Hotel hotel = hotelRepository.findById(hotelDTO.getHotelId()).get();
		
		// mapping
		modelMapper.map(hotelDTO, hotel);
		
		// set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		Date dateNow = DateUtil.getDateNow();
		hotel.setLastModifiedBy(accountId);
		hotel.setLastModifiedAt(dateNow);
		
		// update hotel
		hotel = hotelRepository.save(hotel);

		return hotel;
	}

	@Override
	public Hotel getDetail(String hotelId) {
		// check exists
		if(!hotelRepository.existsById(hotelId)) {
			throw new CustomException("Cannot find hotel");
		}
		
		// get hotel from db
		Hotel hotel = hotelRepository.findById(hotelId).get();
		
		return hotel;
	}

	@Override
	public List<Hotel> getAll() {
		// get all hotel from db
		List<Hotel> hotelList = hotelRepository.findAll();

		return hotelList;
	}

	@Override
	public boolean delete(String hotelId) {
		// check exists
		if(!hotelRepository.existsById(hotelId)) {
			throw new CustomException("Cannot find hotel");
		}
		
		// delete hotel
		hotelRepository.deleteById(hotelId);
		
		return true;
	}
	
	private void checkFieldCondition(HotelDTO hotelDTO) {
		// check null
		if(hotelDTO.getHotelName() == null || hotelDTO.getHotelName() == "") {
			throw new CustomException("Hotel Name is not null");
		}
		if(hotelDTO.getPhoneNumber() == null || hotelDTO.getPhoneNumber() == "") {
			throw new CustomException("Phone Number is not null");
		}
		if(hotelDTO.getAddress() == null) {
			throw new CustomException("Address is not null");
		}
		if(hotelDTO.getRoom() == null) {
			throw new CustomException("Room is not null");
		}
		
		// check unique
	}

}
