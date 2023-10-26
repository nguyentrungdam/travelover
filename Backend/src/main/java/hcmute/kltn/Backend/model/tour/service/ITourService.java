package hcmute.kltn.Backend.model.tour.service;

import java.util.List;

import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;

public interface ITourService {
	public Tour create(TourDTO tourDTO);
	public Tour update(TourDTO tourDTO);
	public Tour getDetail(String tourId);
	public List<Tour> getAll();
	public boolean delete(String tourId);
	
	public Tour createTour(TourCreate tourCreate);
	public Tour updateTour(TourUpdate tourUpdate);
}