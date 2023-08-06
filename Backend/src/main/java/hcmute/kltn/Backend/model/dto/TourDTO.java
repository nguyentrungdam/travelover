package hcmute.kltn.Backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourDTO {
	private String tourId;
	private String tourTitle;
	private String thumbnail; // Foreign key
	private int numberOfDay;
	private int numberOfNight;
	private String provinceOrCity;
	private String districtOrCounty;
	private String wardOrCommune;
	private String moreLocation;
	private String contact;
	private String tourDescription;
	private String suitablePerson;
	private String highlight;
	private String termAndCondition;
	private int price;
}
