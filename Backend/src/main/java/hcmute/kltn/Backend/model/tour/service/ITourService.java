package hcmute.kltn.Backend.model.tour.service;

import java.util.List;

import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourFilter;
import hcmute.kltn.Backend.model.tour.dto.TourSearch;
import hcmute.kltn.Backend.model.tour.dto.TourSearchRes;
import hcmute.kltn.Backend.model.tour.dto.TourSort;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.tour.dto.extend.Discount;

public interface ITourService {
	public TourDTO createTour(TourCreate tourCreate);
	public TourDTO updateTour(TourUpdate tourUpdate);
	public TourDTO getDetailTour(String tourId);
	public Discount updateDiscount(String tourId, Discount discount);
	public List<TourDTO> getAllTour();
	public List<TourSearchRes> searchTour(TourSearch tourSearch);
	public List<TourSearchRes> searchFilter(TourFilter tourFilter, List<TourSearchRes> tourSearchResList);
	public List<TourSearchRes> searchSort(TourSort tourSort, List<TourSearchRes> tourSearchResList);
}