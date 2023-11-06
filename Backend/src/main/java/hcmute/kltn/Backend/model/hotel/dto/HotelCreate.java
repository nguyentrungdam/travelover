package hcmute.kltn.Backend.model.hotel.dto;

import java.util.List;

import hcmute.kltn.Backend.model.base.extend.Address;
import hcmute.kltn.Backend.model.base.extend.Contact;
import hcmute.kltn.Backend.model.base.extend.Image;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelCreate {
	private String eHotelId;
	private String hotelName;
	private String hotelDescription;
	private Contact contact;
//	private List<Image> image;
	private Address address;
}
