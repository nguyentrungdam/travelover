package hcmute.kltn.Backend.model.hotel.service;

import java.util.List;

import hcmute.kltn.Backend.model.hotel.dto.HotelCreate;
import hcmute.kltn.Backend.model.hotel.dto.HotelSearch;
import hcmute.kltn.Backend.model.hotel.dto.HotelUpdate;
import hcmute.kltn.Backend.model.hotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.hotel.dto.entity.Hotel;
import hcmute.kltn.Backend.model.hotel.dto.extend.Room;

public interface IHotelService {
	public Hotel createHotel(HotelCreate hotelCreate);
	public Hotel updateHotel(HotelUpdate hotelUpdate);
	public Hotel getDetailHotel(String hotelId);
	public List<Hotel> getAllHotel();
	public List<Hotel> searchHotel(HotelSearch hotelSearch);
	public Room getRoomDetail(String hotelId, String roomId);
	public List<Room> searchRoom(RoomSearch roomSearch);
}
