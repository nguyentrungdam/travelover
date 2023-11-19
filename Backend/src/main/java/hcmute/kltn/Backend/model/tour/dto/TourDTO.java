package hcmute.kltn.Backend.model.tour.dto;

import java.util.List;

import hcmute.kltn.Backend.model.base.extend.Address;
import hcmute.kltn.Backend.model.base.extend.Image;
import hcmute.kltn.Backend.model.tour.dto.extend.Discount;
import hcmute.kltn.Backend.model.tour.dto.extend.ReasonableTime;
import hcmute.kltn.Backend.model.tour.dto.extend.Reviewer;
import hcmute.kltn.Backend.model.tour.dto.extend.TourDetail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourDTO {
	private String tourId;
	private String tourTitle; // not null, unique
	private String thumbnailUrl; 
	private List<Image> image;
	private String video;
	private int numberOfDay; // not null
	private Address address; // not null
	private String tourDescription;
	private int price;
	private String tourDetail;
	private List<TourDetail> tourDetailList; // not null
	private ReasonableTime reasonableTime; // not null
	private String suitablePerson;
	private String termAndCondition;
	private int numberOfReviewer;
	private int rate;
	private List<Reviewer> reviewer;
	private List<Discount> discount;
}
