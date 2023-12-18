package hcmute.kltn.Backend.model.tour.service;

import java.util.HashMap;
import java.util.List;

import hcmute.kltn.Backend.model.province.dto.LocationDTO;
import hcmute.kltn.Backend.model.tour.dto.StatusUpdate;
import hcmute.kltn.Backend.model.tour.dto.TourCreate;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.TourFilter;
import hcmute.kltn.Backend.model.tour.dto.TourSearch;
import hcmute.kltn.Backend.model.tour.dto.TourSearchRes;
import hcmute.kltn.Backend.model.tour.dto.TourSort;
import hcmute.kltn.Backend.model.tour.dto.TourUpdate;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;

public interface ITourService {
	public TourDTO createTour(TourCreate tourCreate);
	public TourDTO updateTour(TourUpdate tourUpdate);
	public TourDTO getDetailTour(String tourId);
	public TourDTO updateStatus(StatusUpdate statusUpdate);
	
	public List<TourDTO> getAllTour();
	public List<TourSearchRes> searchTour(TourSearch tourSearch);
	public List<TourSearchRes> searchFilter(TourFilter tourFilter, List<TourSearchRes> tourSearchResList);
	public List<TourSearchRes> searchSort(TourSort tourSort, List<TourSearchRes> tourSearchResList);
	public List<TourSearchRes> getAllDiscountTour();
	public List<TourDTO> listTourSearch(String keyword);
	public List<TourDTO> listTourFilter(HashMap<String, String> tourFilter, List<TourDTO> tourDTOList);
	public List<TourDTO> listTourSort(TourSort tourSort, List<TourDTO> tourDTOList);
	
	public void updateNumberOfOrdered(String tourId);
	public void updateIsDiscount();
	public void updateIsDiscountNoCheck();
}