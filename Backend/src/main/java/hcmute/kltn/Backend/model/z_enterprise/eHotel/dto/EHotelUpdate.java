package hcmute.kltn.Backend.model.z_enterprise.eHotel.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend.Room;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EHotelUpdate {
	@JsonProperty("eHotelId")
	private String eHotelId;
	@JsonProperty("eHotelName")
	private String eHotelName; // not null
	private String description;
	private String phoneNumber; // not null
}
