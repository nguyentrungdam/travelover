package hcmute.kltn.Backend.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import hcmute.kltn.Backend.model.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Tour")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class Tour extends BaseEntity{
	@Id
	@Column(name = "Tour_Id")
	private String tourId;
	@Column(name = "Tour_Title", nullable = false)
	private String tourTitle;
	@OneToOne
    @JoinColumn(name = "Thumbnail", nullable = true)
	private Image thumbnail;
	@Column(name = "Number_Of_Day", nullable = false)
	private int numberOfDay;
	@Column(name = "Number_Of_Night", nullable = false)
	private int numberOfNight;
	@Column(name = "Province_Or_City", nullable = false)
	private String provinceOrCity;
	@Column(name = "District_Or_County", nullable = false)
	private String districtOrCounty;
	@Column(name = "Ward_Or_Commune", nullable = false)
	private String wardOrCommune;
	@Column(name = "More_Location", nullable = true)
	private String moreLocation;
	@Column(name = "Contact", nullable = false)
	private String contact;
	@Column(name = "Tour_Description", nullable = true)
	private String tourDescription;
	@Column(name = "Suitable_Person", nullable = true)
	private String suitablePerson;
	@Column(name = "Highlight", nullable = true)
	private String highlight;
	@Column(name = "Term_And_Condition", nullable = true)
	private String termAndCondition;
	@Column(name = "Price", nullable = false)
	private int price;
}
