package hcmute.kltn.Backend.model.tour.dto.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import hcmute.kltn.Backend.model.base.BaseEntity;
import hcmute.kltn.Backend.model.base.extend.Address;
import hcmute.kltn.Backend.model.base.extend.Image;
import hcmute.kltn.Backend.model.tour.dto.extend.Discount;
import hcmute.kltn.Backend.model.tour.dto.extend.ReasonableTime;
import hcmute.kltn.Backend.model.tour.dto.extend.Reviewer;
import hcmute.kltn.Backend.model.tour.dto.extend.TourDetail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Document(collection = "tour")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class Tour extends BaseEntity{
	@Id
	private String tourId;
	private String tourTitle; // not null, unique
	private String thumbnailUrl; // not null
	private List<Image> image;
	private String video;
	private int numberOfDay; // not null
	private Address address; // not null
	private String tourDescription;
	private List<TourDetail> tourDetail; // not null
	private ReasonableTime reasonableTime; // not null
	private String suitablePerson;
	private String termAndCondition;
	private int numberOfReviewer;
	private int rate;
	private List<Reviewer> reviewer;
	private List<Discount> discount;
}


