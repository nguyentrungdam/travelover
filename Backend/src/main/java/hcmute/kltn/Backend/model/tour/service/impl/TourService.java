package hcmute.kltn.Backend.model.tour.service.impl;

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
import hcmute.kltn.Backend.model.hotel.dto.HotelSearch;
import hcmute.kltn.Backend.model.hotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.hotel.service.IHotelService;
import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourSearch;
import hcmute.kltn.Backend.model.tour.dto.TourSearchRes;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.tour.dto.extend.Hotel;
import hcmute.kltn.Backend.model.tour.dto.extend.Room;
import hcmute.kltn.Backend.model.tour.dto.extend.TourDetail;
import hcmute.kltn.Backend.model.tour.repository.TourRepository;
import hcmute.kltn.Backend.model.tour.service.ITourService;
import hcmute.kltn.Backend.util.LocalDateUtil;

@Service
public class TourService implements ITourService{
	@Autowired
	private TourRepository tourRepository;
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
	
	private List<TourDetail> deteilToList(String tourDetail) {
		List<TourDetail> tourDetailList = new ArrayList<>();
		
		String[] tourDetailSplit = tourDetail.split("\\n");
		if(tourDetailSplit.length % 2 != 0) {
			throw new CustomException("The number of titles and descriptions does not match");
		}
		
		for(int i = 0; i < tourDetailSplit.length; i += 2) {
			TourDetail tourDetailNew = new TourDetail();
			tourDetailNew.setTitle(tourDetailSplit[i]);
			tourDetailNew.setDescription(tourDetailSplit[i + 1]);
			tourDetailList.add(tourDetailNew);
		}
		
		return tourDetailList;
	}

    private String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Tour.class);
        return collectionName;
    }
    
    private void checkFieldCondition(TourDTO tourDTO) {
		// check null
		if(tourDTO.getTourTitle() == null || tourDTO.getTourTitle().equals("")) {
			throw new CustomException("Title is not null");
		}
//		if(tourDTO.getThumbnailUrl() == null || tourDTO.getThumbnailUrl() == "") {
//			throw new CustomException("Thumbnail Url is not null");
//		}
		if(tourDTO.getNumberOfDay() <= 0 ) {
			throw new CustomException("Number Of Day must be greater than 0");
		}
		if(tourDTO.getAddress() == null) {
			throw new CustomException("Address is not null");
		}
		if(tourDTO.getReasonableTime() == null) {
			throw new CustomException("Reasonable Time is not null");
		}
		
		// check unique
		if(tourDTO.getTourId() == null || tourDTO.getTourId().equals("")) {
			if(tourRepository.existsByTourTitle(tourDTO.getTourTitle().trim())) {
				throw new CustomException("Title is already");
			}
		} else {
			Tour tour = tourRepository.findById(tourDTO.getTourId()).get();
			List<Tour> titleList = tourRepository.findAllByTourTitle(tourDTO.getTourTitle());
			for(Tour item : titleList) {
				if (item.getTourTitle() == tour.getTourTitle() && item.getTourId() != tour.getTourId()) {
					throw new CustomException("Title is already");
				}
			}
		}
	}

	private Tour create(TourDTO tourDTO) {
		// check field condition
		checkFieldCondition(tourDTO);
		
		// Mapping
		Tour tour = new Tour();
		modelMapper.map(tourDTO, tour);
		
		// set tour detail list
		tour.setTourDetailList(deteilToList(tour.getTourDetail()));

		// Set default value
		String tourId = iGeneratorSequenceService.genId(getCollectionName());
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		tour.setTourId(tourId);
		tour.setStatus(true);
		tour.setCreatedBy(accountId);
		tour.setCreatedAt(dateNow);
		tour.setLastModifiedBy(accountId);
		tour.setLastModifiedAt(dateNow);
		
		tour = tourRepository.save(tour);
		
		return tour;
	}

	private Tour update(TourDTO tourDTO) {
		// Check exists
		if (!tourRepository.existsById(tourDTO.getTourId())) {
			throw new CustomException("Cannot find tour");
		}
				
		// check field condition
		checkFieldCondition(tourDTO);
		
		// get tour from database
		Tour tour = tourRepository.findById(tourDTO.getTourId()).get();

		// Mapping
		modelMapper.map(tourDTO, tour);
		
		// set tour detail list
		tour.setTourDetailList(deteilToList(tour.getTourDetail()));

		// Set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		tour.setLastModifiedBy(accountId);
		tour.setLastModifiedAt(dateNow);
		
		// update tour
		tour = tourRepository.save(tour);
		
		return tour;
	}

	private Tour getDetail(String tourId) {
		// Check exists
		if (!tourRepository.existsById(tourId)) {
			throw new CustomException("Cannot find tour");
		}
		
		// Find tour
		Tour tour = tourRepository.findById(tourId).get();
		
		return tour;
	}

	private List<Tour> getAll() {
		// Find tour
		List<Tour> list = tourRepository.findAll();
		
		return list;
	}

	private boolean delete(String tourId) {
		// Check exists
		if (!tourRepository.existsById(tourId)) {
			throw new CustomException("Cannot find tour");
		}
		
		// Delete tour
		tourRepository.deleteById(tourId);
		
		return true;
	}
	
	private List<Tour> search(String keyword) {
		// init Tour List
		List<Tour> tourList = new ArrayList<>();
		
		if(keyword == null || keyword.equals("")) {
			tourList = getAll();
		} else {
			// create list field name
			List<Criteria> criteriaList = new ArrayList<>();
			for(Field itemField : Tour.class.getDeclaredFields()) {
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
			tourList = mongoTemplate.find(query, Tour.class);
		}
		
		return tourList;
	}

	@Override
	public Tour createTour(TourCreate tourCreate) {
		// mapping tourDTO
		TourDTO tourDTO = new TourDTO();
		modelMapper.map(tourCreate, tourDTO);
		
		// create tour
		Tour tour = new Tour();
		tour = create(tourDTO);
		
		return tour;
	}

	@Override
	public Tour updateTour(TourUpdate tourUpdate) {
		// mapping tourDTO
		TourDTO tourDTO = new TourDTO();
		modelMapper.map(tourUpdate, tourDTO);
		
		// check condition
		checkFieldCondition(tourDTO);
		
		// update tour
		Tour tourNew = update(tourDTO);
		
		return tourNew;
	}

	@Override
	public Tour getDetailTour(String tourId) {
		Tour tour  = getDetail(tourId);

		return tour;
	}

	@Override
	public List<Tour> getAllTour() {
		List<Tour> tourList = getAll();

		return tourList;
	}
	
	@Override
	public List<TourSearchRes> searchTour(TourSearch tourSearch) {
		// search with keyword
		List<Tour> tourList = new ArrayList<>();
		List<Tour> tourListClone = new ArrayList<>();
		List<TourSearchRes> tourSearchResList = new ArrayList<>(); 
		
		if(tourSearch.getKeyword() != null) {
			tourList = search(tourSearch.getKeyword());
		} else {
			tourList = getAll();
		}
		
		// search with province
		if(tourSearch.getProvince() != null && !tourSearch.getProvince().equals("")) {
			tourListClone.clear();
			tourListClone.addAll(tourList);
			for(Tour itemTour : tourListClone) {
				if(!itemTour.getAddress().getProvince().equals(tourSearch.getProvince())) {
					tourList.remove(itemTour);
					if(tourList.size() == 0) {
						break;
					}
				}
			}
		}
		
		// search with district
		if(tourSearch.getDistrict() != null && !tourSearch.getDistrict().equals("")) {
			tourListClone.clear();
			tourListClone.addAll(tourList);
			for(Tour itemTour : tourListClone) {
				if(!itemTour.getAddress().getDistrict().equals(tourSearch.getDistrict())) {
					tourList.remove(itemTour);
					if(tourList.size() == 0) {
						break;
					}
				}
			}
		}
		
		// search with commune
		if(tourSearch.getCommune() != null && !tourSearch.getCommune().equals("")) {
			tourListClone.clear();
			tourListClone.addAll(tourList);
			for(Tour itemTour : tourListClone) {
				if(!itemTour.getAddress().getCommune().equals(tourSearch.getCommune())) {
					tourList.remove(itemTour);
					if(tourList.size() == 0) {
						break;
					}
				}
			}
		}
		
		// search with number of day
		
		if(tourSearch.getNumberOfDay() != null && !tourSearch.getNumberOfDay().equals("")) {
			String[] noDaySplit = tourSearch.getNumberOfDay().split("-");
			int startDay = Integer.parseInt(noDaySplit[0]);
			int endDay = Integer.parseInt(noDaySplit[1]);
			tourListClone.clear();
			tourListClone.addAll(tourList);
			for(Tour itemTour : tourListClone) {
				if(itemTour.getNumberOfDay() < startDay || itemTour.getNumberOfDay() > endDay) {
					tourList.remove(itemTour);
					if(tourList.size() == 0) {
						break;
					}
				}
			}
		}
		
		// search with start date
		
		// search with number of people
		
		for(Tour itemTour : tourList) {
			TourSearchRes tourSearchRes = new TourSearchRes();
			tourSearchRes.setTour(itemTour);
			
			if(tourSearch.getStartDate() != null && tourSearch.getNumberOfPeople() > 0) {
				// search hotel
				HotelSearch hotelSearch = new HotelSearch();
				hotelSearch.setProvince(tourSearch.getProvince());
				hotelSearch.setDistrict(tourSearch.getDistrict());
				hotelSearch.setCommune(tourSearch.getCommune());
				List<hcmute.kltn.Backend.model.hotel.dto.entity.Hotel> hotelList = iHotelService.searchHotel(hotelSearch);
				
				// search room in hotel
				for(hcmute.kltn.Backend.model.hotel.dto.entity.Hotel itemHotel : hotelList) {
					RoomSearch roomSearch = new RoomSearch();
					roomSearch.setEHotelId(itemHotel.getEHotelId());
					roomSearch.setStartDate(tourSearch.getStartDate());
					roomSearch.setEndDate(tourSearch.getStartDate().plusDays(itemTour.getNumberOfDay()));
					roomSearch.setNumberOfPeople(tourSearch.getNumberOfPeople());
					List<hcmute.kltn.Backend.model.hotel.dto.extend.Room> roomList = iHotelService.searchRoom(roomSearch);
					if(roomList.size() > 0) {
						// mapping hotel
						Hotel hotel = new Hotel();
						modelMapper.map(itemHotel, hotel);
						
						// mapping room
						List<Room> roomListRes = new ArrayList<>();
						for(hcmute.kltn.Backend.model.hotel.dto.extend.Room itemRoom : roomList) {
							Room room = new Room();
							modelMapper.map(itemRoom, room);
							roomListRes.add(room);
						}

						hotel.setRoom(roomListRes);
						
						tourSearchRes.setHotel(hotel);

						break;
					}
				}
			}
			
			System.out.println("tourId before = " + tourSearchRes.getTour().getTourId());
			tourSearchResList.add(tourSearchRes);
			for (TourSearchRes itemTourSearchRes : tourSearchResList) {
				System.out.println("tourId after = " + itemTourSearchRes.getTour().getTourId());
			}
		}

		return tourSearchResList;
	}
}