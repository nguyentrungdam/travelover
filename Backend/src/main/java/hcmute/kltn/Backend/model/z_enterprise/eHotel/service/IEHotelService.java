package hcmute.kltn.Backend.model.z_enterprise.eHotel.service;

import java.util.List;

import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelDTO;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderCreate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelOrderUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.EHotelUpdate;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.RoomSearch;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.entity.EHotel;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Order;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room;
import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room2;

public interface IEHotelService {
	public EHotel createEHotel(EHotelCreate eHotelCreate);
	public EHotel updateEHotel(EHotelUpdate eHotelUpdate);
	public EHotel getDetailEHotel(String eHotelId);
	public List<EHotel> getAllEHotel();
	public List<EHotel> searchEHotel(String keyword);
	public List<Room> searchRoom(RoomSearch roomSearch);
	public List<Room2> searchRoom2(RoomSearch roomSearch);
	
	public Order createOrder(EHotelOrderCreate eHotelOrderCreate);
	public Order updateOrder(EHotelOrderUpdate eHotelOrderUpdate);
	public Order getOneOrder(String eHotelId, String orderId);
	public List<Order> getAllOrder(String eHotelId);
}
