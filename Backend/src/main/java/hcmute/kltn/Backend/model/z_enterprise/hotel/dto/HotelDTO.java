package hcmute.kltn.Backend.model.z_enterprise.hotel.dto;

import java.util.List;

import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.extend.Address;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.extend.Image;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.extend.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelDTO {
	private String hotelId;
	private String hotelName; // not null
	private String description;
	private String phoneNumber; // not null
	private Address address; // not null
	private List<Image> image;
	private List<Room> room; // not null
}
