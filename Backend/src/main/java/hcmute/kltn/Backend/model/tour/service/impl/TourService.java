package hcmute.kltn.Backend.model.tour.service.impl;

import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.dto.entity.Account;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.tour.repository.TourRepository;
import hcmute.kltn.Backend.model.tour.service.ITourService;
import hcmute.kltn.Backend.util.DateUtil;

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

    public String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Tour.class);
        return collectionName;
    }

	@Override
	public Tour create(TourDTO tourDTO) {
		// check field condition
		checkFieldCondition(tourDTO);
		
		// Mapping
		Tour tour = new Tour();
		modelMapper.map(tourDTO, tour);

		// Set default value
		String tourId = iGeneratorSequenceService.genId(getCollectionName());
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		Date dateNow = DateUtil.getDateNow();
		tour.setTourId(tourId);
		tour.setStatus(true);
		tour.setCreatedBy(accountId);
		tour.setCreatedAt(dateNow);
		tour.setLastModifiedBy(accountId);
		tour.setLastModifiedAt(dateNow);
		
		tour = tourRepository.save(tour);
		
		return tour;
	}

	@Override
	public Tour update(TourDTO tourDTO) {
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

		// Set default value
		String accountId = iAccountDetailService.getCurrentAccount().getAccountId();
		Date dateNow = DateUtil.getDateNow();
		tour.setLastModifiedBy(accountId);
		tour.setLastModifiedAt(dateNow);
		
		// update tour
		tour = tourRepository.save(tour);
		
		return tour;
	}

	@Override
	public Tour getDetail(String tourId) {
		// Check exists
		if (!tourRepository.existsById(tourId)) {
			throw new CustomException("Cannot find tour");
		}
		
		// Find tour
		Tour tour = tourRepository.findById(tourId).get();
		
		return tour;
	}

	@Override
	public List<Tour> getAll() {
		// Find tour
		List<Tour> list = tourRepository.findAll();
		
		return list;
	}

	@Override
	public boolean delete(String tourId) {
		// Check exists
		if (!tourRepository.existsById(tourId)) {
			throw new CustomException("Cannot find tour");
		}
		
		// Delete tour
		tourRepository.deleteById(tourId);
		
		return true;
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
		// check exists
		if(!tourRepository.existsById(tourUpdate.getTourId())) {
			throw new CustomException("Can not find tour");
		}
		
		// mapping tourDTO
		TourDTO tourDTO = new TourDTO();
		modelMapper.map(tourUpdate, tourDTO);
		
		// check condition
		checkFieldCondition(tourDTO);
		
		// update tour
		Tour tourNew = update(tourDTO);
		
		return tourNew;
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
}