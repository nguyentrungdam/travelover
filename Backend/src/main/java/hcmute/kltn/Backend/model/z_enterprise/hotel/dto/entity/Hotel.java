package hcmute.kltn.Backend.model.z_enterprise.hotel.dto.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import hcmute.kltn.Backend.model.base.BaseEntity;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.extend.Address;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.extend.Image;
import hcmute.kltn.Backend.model.z_enterprise.hotel.dto.extend.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Document(collection = "z_enterprise_hotel")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class Hotel extends BaseEntity{
	@Id
	private String hotelId;
	private String hotelName; // not null
	private String description;
	private String phoneNumber; // not null
	private Address address; // not null
	private List<Image> image;
	private List<Room> room; // not null
}
