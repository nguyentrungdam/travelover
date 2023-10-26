package hcmute.kltn.Backend.model.z_enterprise.hotel.service;

import java.util.List;

import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.HotelDTO;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.entity.Hotel;

public interface IHotelService {
	public Hotel create(HotelDTO hotelDTO);
	public Hotel update(HotelDTO hotelDTO);
	public Hotel getDetail(String hotelId);
	public List<Hotel> getAll();
	public boolean delete(String hotelId);
	
//	public Hotel createTour(TourCreate tourCreate);
//	public Hotel updateTour(TourUpdate tourUpdate);
}
