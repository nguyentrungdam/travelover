package hcmute.kltn.Backend.model.tour.service;

import java.util.List;

import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourSearch;
import hcmute.kltn.Backend.model.tour.dto.TourSearchRes;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;

public interface ITourService {
	public Tour createTour(TourCreate tourCreate);
	public Tour updateTour(TourUpdate tourUpdate);
	public Tour getDetailTour(String tourId);
	public List<Tour> getAllTour();
	public List<TourSearchRes> searchTour(TourSearch tourSearch);
}