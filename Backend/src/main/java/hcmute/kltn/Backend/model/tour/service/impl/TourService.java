package hcmute.kltn.Backend.model.tour.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.model.hotel.dto.HotelSearch;
import hcmute.kltn.Backend.model.hotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.hotel.service.IHotelService;
import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourFilter;
import hcmute.kltn.Backend.model.tour.dto.TourSearch;
import hcmute.kltn.Backend.model.tour.dto.TourSearchRes;
import hcmute.kltn.Backend.model.tour.dto.TourSort;
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
	@Autowired
	private IImageService iImageService;
	
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
    
    private void checkFieldCondition(Tour tour) {
		// check null
		if(tour.getTourTitle() == null || tour.getTourTitle().equals("")) {
			throw new CustomException("Title is not null");
		}
		if(tour.getNumberOfDay() <= 0 ) {
			throw new CustomException("Number Of Day must be greater than 0");
		}
		if(tour.getNumberOfNight() < 0 ) {
			throw new CustomException("Number Of Night must be greater than or equal 0");
		}
		if(tour.getAddress() == null) {
			throw new CustomException("Address is not null");
		}
		if(tour.getTourDetailList() == null) {
			throw new CustomException("Tour Detail List Time is not null");
		}
		if(tour.getReasonableTime() == null) {
			throw new CustomException("Reasonable Time is not null");
		}
		
		// check unique
		if(tour.getTourId() == null || tour.getTourId().equals("")) {
			if(tourRepository.existsByTourTitle(tour.getTourTitle().trim())) {
				throw new CustomException("Title is already");
			}
		} else {
			Tour tourFind = tourRepository.findById(tour.getTourId()).get();
			List<Tour> titleList = tourRepository.findAllByTourTitle(tour.getTourTitle());
			for(Tour item : titleList) {
				if (item.getTourTitle() == tourFind.getTourTitle() && item.getTourId() != tourFind.getTourId()) {
					throw new CustomException("Title is already");
				}
			}
		}
	}
    
    private Tour create(Tour tour) {
    	// check field condition
		checkFieldCondition(tour);
    	
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
		
		// create tour
		Tour tourNew = new Tour();
		tourNew = tourRepository.save(tour);
		
		return tourNew;
	}
    
    private Tour update(Tour tour) {
    	// Check exists
		if (!tourRepository.existsById(tour.getTourId())) {
			throw new CustomException("Cannot find tour");
		}
		
		// check field condition
		checkFieldCondition(tour);
    	
    	// Set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		LocalDate dateNow = LocalDateUtil.getDateNow();
		tour.setLastModifiedBy(accountId);
		tour.setLastModifiedAt(dateNow);
		
		// update tour
		Tour tourNew = new Tour();
		tourNew = tourRepository.save(tour);
		
		return tourNew;
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

	private void delete(String tourId) {
		// Check exists
		if (tourRepository.existsById(tourId)) {
			tourRepository.deleteById(tourId);
		}
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
	
	private TourDTO getTourDTO(Tour tour) {
		// mapping tourDTO
		TourDTO tourDTONew = new TourDTO();
		modelMapper.map(tour, tourDTONew);
		
		return tourDTONew;
	}
	
	private List<TourDTO> getTourDTOList(List<Tour> tourList) {
		List<TourDTO> tourDTOList = new ArrayList<>();
		for (Tour itemTour : tourList) {
			tourDTOList.add(getTourDTO(itemTour));
		}
		return tourDTOList;
	}

	@Override
	public TourDTO createTour(TourCreate tourCreate) {
		// mapping tour
		Tour tour = new Tour();
		modelMapper.map(tourCreate, tour);

		// set tour detail list
		tour.setTourDetailList(deteilToList(tour.getTourDetail()));
		
		// check field condition
		checkFieldCondition(tour);

		// create tour
		Tour tourNew = new Tour();
		tourNew = create(tour);
		
		return getTourDTO(tourNew);
	}

	@Override
	public TourDTO updateTour(TourUpdate tourUpdate) {
		// get tour from database
		Tour tour = getDetail(tourUpdate.getTourId());
		
		// check thumbnail image and delete
		if ((tour.getThumbnailUrl() != null 
				&& !tour.getThumbnailUrl().equals(""))
				&& !tour.getThumbnailUrl().equals(tourUpdate.getThumbnailUrl())) {
			boolean checkDelete = iImageService.deleteImageByUrl(tour.getThumbnailUrl());
			if (checkDelete == false) {
				throw new CustomException("An error occurred during the processing of the old image");
			}
		}
		
		// check image update
		boolean checkExists = false;
		if (tour.getImage() != null) {
			for (String itemString : tour.getImage()) {
				checkExists = false;
				for (String itemStringDTO : tourUpdate.getImage()) {
					if (itemString.equals(itemStringDTO)) {
						checkExists = true;
						break;
					}
				}
				
				if (checkExists == false) {
					boolean checkDelete = false;
					checkDelete = iImageService.deleteImageByUrl(itemString);
					if (checkDelete == false) {
						throw new CustomException("An error occurred during the processing of the old image");
					}
				}
			}
		}
		
		// mapping tour
		modelMapper.map(tourUpdate, tour);
		
		// update image by handle
		tour.setImage(tourUpdate.getImage());
		
		// set tour detail list
		tour.setTourDetailList(deteilToList(tour.getTourDetail()));
		
		// update tour
		Tour tourNew = new Tour();
		tourNew = update(tour);
		
		return getTourDTO(tourNew);
	}

	@Override
	public TourDTO getDetailTour(String tourId) {
		Tour tour  = getDetail(tourId);

		return getTourDTO(tour);
	}

	@Override
	public List<TourDTO> getAllTour() {
		List<Tour> tourList = new ArrayList<>(getAll());

		return getTourDTOList(tourList);
	}
	
	@Override
	public List<TourSearchRes> searchTour(TourSearch tourSearch) {
		// search with keyword
		List<Tour> tourList = new ArrayList<>();
		List<Tour> tourListClone = new ArrayList<>();
		List<TourSearchRes> tourSearchResList = new ArrayList<>(); 
		int totalPrice = 0;
		
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
			totalPrice = 0;
			TourSearchRes tourSearchRes = new TourSearchRes();
			tourSearchRes.setTour(itemTour);
			totalPrice += itemTour.getPrice();
			
			if(tourSearch.getStartDate() != null && tourSearch.getNumberOfPeople() > 0) {
				// search hotel
				HotelSearch hotelSearch = new HotelSearch();
				hotelSearch.setProvince(tourSearch.getProvince());
				hotelSearch.setDistrict(tourSearch.getDistrict());
				hotelSearch.setCommune(tourSearch.getCommune());
				List<hcmute.kltn.Backend.model.hotel.dto.HotelDTO> hotelDTOList = iHotelService.searchHotel(hotelSearch);
				
				// search room in hotel
				for(hcmute.kltn.Backend.model.hotel.dto.HotelDTO itemHotel : hotelDTOList) {
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
							totalPrice += room.getPrice();
						}

						hotel.setRoom(roomListRes);
						
						tourSearchRes.setHotel(hotel);

						break;
					}
				}
			}
			
			tourSearchRes.setTotalPrice(totalPrice);
			tourSearchResList.add(tourSearchRes);
		}

		return tourSearchResList;
	}

	@Override
	public List<TourSearchRes> searchFilter(TourFilter tourFilter, List<TourSearchRes> tourSearchResList) {
		try {
			// price filter
			int minPrice = Integer.valueOf(tourFilter.getMinPrice());
			int maxPrice = Integer.valueOf(tourFilter.getMaxPrice());
			if (minPrice >= 0 && maxPrice >= minPrice) {
				List<TourSearchRes> tourSearchResListClone = new ArrayList<>();
				tourSearchResListClone.addAll(tourSearchResList);
				for (TourSearchRes itemTourSearchRes : tourSearchResListClone) {
					if (itemTourSearchRes.getTotalPrice() < minPrice 
							|| itemTourSearchRes.getTotalPrice() > maxPrice) {
						tourSearchResList.remove(itemTourSearchRes);
					}
				}
			}
		} catch (Exception e) {
			System.out.println("Tour search filter min max: " + e.getMessage());
		}
		
		try {
			// rating filter
			int ratingFilter = Integer.valueOf(tourFilter.getRatingFilter());
			if (ratingFilter >= 1 && ratingFilter <= 5) {
				List<TourSearchRes> tourSearchResListClone = new ArrayList<>();
				tourSearchResListClone.addAll(tourSearchResList);
				for (TourSearchRes itemTourSearchRes : tourSearchResListClone) {
					if (itemTourSearchRes.getTour().getRate() < ratingFilter) {
						tourSearchResList.remove(itemTourSearchRes);
					}
				}
			}
		} catch (Exception e) {
			System.out.println("Tour search filter rating: " + e.getMessage());
		}
		
		return tourSearchResList;
	}

	@Override
	public List<TourSearchRes> searchSort(TourSort tourSort, List<TourSearchRes> tourSearchResList) {
		// sort by popular
		try {
			if (tourSort.getSortBy().equals("popular")) {
				Collections.sort(tourSearchResList, new Comparator<TourSearchRes>() {
		            @Override
		            public int compare(TourSearchRes e1, TourSearchRes e2) {
		            	int result = 0;
		            	if (tourSort.getOrder().equals("asc")) {
		            		result = Integer.compare(e1.getTour().getNumberOfOrdered(), e2.getTour().getNumberOfOrdered());
		            	} else if (tourSort.getOrder().equals("desc")) {
		            		result = Integer.compare(e2.getTour().getNumberOfOrdered(), e1.getTour().getNumberOfOrdered());
		            	} else {
		            		result = 0;
		            	}
		                return result;
		            }
		        });
			}
		} catch (Exception e) {
			System.out.println("Tour search sort by popular: " + e.getMessage());
		}
		
		// sort by price
		try {
			if (tourSort.getSortBy().equals("price")) {
				Collections.sort(tourSearchResList, new Comparator<TourSearchRes>() {
		            @Override
		            public int compare(TourSearchRes e1, TourSearchRes e2) {
		            	int result = 0;
		            	if (tourSort.getOrder().equals("asc")) {
		            		result = Integer.compare(e1.getTotalPrice(), e2.getTotalPrice());
		            	} else if (tourSort.getOrder().equals("desc")) {
		            		result = Integer.compare(e2.getTotalPrice(), e1.getTotalPrice());
		            	} else {
		            		result = 0;
		            	}
		                return result;
		            }
		        });
			}
		} catch (Exception e) {
			System.out.println("Tour search sort by price: " + e.getMessage());
		}
		
		// sort by promotion
		try {	
//		if (tourSort.getSortBy().equals("promotion")) {
//			Collections.sort(tourSearchResList, new Comparator<TourSearchRes>() {
//	            @Override
//	            public int compare(TourSearchRes e1, TourSearchRes e2) {
//	                int result = Integer.compare(e1.getTour().getNumberOfOrdered(), e2.getTour().getNumberOfOrdered());
////		                if (result == 0) {
////		                    result = e1.field2.compareTo(e2.field2);
////		                }
//	                return result;
//	            }
//	        });
//		}	
		} catch (Exception e) {
			System.out.println("Tour search sort by promotion: " + e.getMessage());
		}

		return tourSearchResList;
	}
}