package hcmute.kltn.Backend.service.impl;

import java.util.Date;
import java.util.List;

import javax.persistence.Table;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.dto.ImageDTO;
import hcmute.kltn.Backend.model.dto.TourDTO;
import hcmute.kltn.Backend.model.entity.Image;
import hcmute.kltn.Backend.model.entity.Tour;
import hcmute.kltn.Backend.repository.TourRepository;
import hcmute.kltn.Backend.service.AccountDetailsService;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;
import hcmute.kltn.Backend.service.intf.IImageService;
import hcmute.kltn.Backend.service.intf.ITourService;
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
	private AccountDetailsService accountDetailsService;
	@Autowired
	private IImageService iImageService;
	
	private String tableName = Tour.class.getAnnotation(Table.class).name();

	@Override
	public Tour create(TourDTO tourDTO) {
		// Mapping
		Tour tour = new Tour();
		modelMapper.map(tourDTO, tour);
		
		// Check already

		// Set default value
		String tourId = iGeneratorSequenceService.genId(tableName);
		String accountId = accountDetailsService.getCurrentAccount().getAccountId();
		Date dateNow = DateUtil.getDateNow();
		tour.setTourId(tourId);
		tour.setStatus(true);
		tour.setCreatedBy(accountId);
		tour.setCreatedAt(dateNow);
		tour.setLastModifiedBy(accountId);
		tour.setLastModifiedAt(dateNow);
		
		// Set thumbnail
		if (tourDTO.getThumbnail() != null || tourDTO.getThumbnail() != "") {
			Image image = iImageService.getDetail(tourDTO.getThumbnail());
			tour.setThumbnail(image);
		} 
		
		tour = tourRepository.save(tour);
		
		return tour;
	}

	@Override
	public Tour update(TourDTO tourDTO) {
		// Check exists
		boolean exists = tourRepository.existsById(tourDTO.getTourId());
		if (!exists) {
			throw new CustomException("Cannot find tour");
		}
		
		// Mapping
		Tour tour = tourRepository.findById(tourDTO.getTourId()).get();

		// Mapping
		modelMapper.map(tourDTO, tour);
		
		// Check already

		// Set default value
		String accountId = accountDetailsService.getCurrentAccount().getAccountId();
		Date dateNow = DateUtil.getDateNow();
		tour.setLastModifiedBy(accountId);
		tour.setLastModifiedAt(dateNow);
		
		// Set thumbnail
		Image image = new Image();
		if (tourDTO.getThumbnail() == null || tourDTO.getThumbnail() == "") {
			image = null;
		} else {
			image = iImageService.getDetail(tourDTO.getThumbnail());
			
			// Set thumbnail null
			tour.setThumbnail(null);
			tour = tourRepository.save(tour);
		}
		tour.setThumbnail(image);
		
		tour = tourRepository.save(tour);
		
		return tour;
	}

	@Override
	public Tour getDetail(String tourId) {
		// Check exists
		boolean exists = tourRepository.existsById(tourId);
		if (!exists) {
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
		boolean exists = tourRepository.existsById(tourId);
		if (!exists) {
			throw new CustomException("Cannot find tour");
		}
		
		// Delete tour
		tourRepository.deleteById(tourId);
		
		return true;
	}

	@Override
	public Tour createTour(MultipartFile file, TourDTO tourDTO) {
		// Check image
		if (file != null) {
			Image image = iImageService.createImage(tableName, file);
			tourDTO.setThumbnail(image.getImageId());
		}
		
		return create(tourDTO);
	}

	@Override
	public Tour updateTour(MultipartFile file, TourDTO tourDTO) {
		// Check image
		if (file != null) {
			if (tourDTO.getThumbnail() == null || tourDTO.getThumbnail() == "") {
				Image image = iImageService.createImage(tableName, file);
				tourDTO.setThumbnail(image.getImageId());
			} else {
				Image image = iImageService.getDetail(tourDTO.getThumbnail());
				ImageDTO imageDTO = new ImageDTO();
				modelMapper.map(image, imageDTO);
				iImageService.updateImage(imageDTO, file);
			}	
		}
		
		return update(tourDTO);
	}
}
