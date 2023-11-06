package hcmute.kltn.Backend.model.tour.dto;

import java.util.List;

import hcmute.kltn.Backend.model.base.extend.Address;
import hcmute.kltn.Backend.model.tour.dto.extend.ReasonableTime;
import hcmute.kltn.Backend.model.tour.dto.extend.TourDetail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourCreate {
	private String tourTitle; // not null, unique
	private String video;
	private int numberOfDay; // not null
	private Address address; // not null
	private String tourDescription;
	private List<TourDetail> tourDetail; // not null
	private ReasonableTime reasonableTime; // not null
	private String suitablePerson;
	private String termAndCondition;
}
