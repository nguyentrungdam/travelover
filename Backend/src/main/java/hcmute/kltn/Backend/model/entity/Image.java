package hcmute.kltn.Backend.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import hcmute.kltn.Backend.model.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Image")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class Image extends BaseEntity{
	@Id
	@Column(name = "Image_Id")
	private String imageId;
	@Column(name = "Public_Id", unique = true, nullable = false)
	private String publicId;
	@Column(name = "Url", unique = true, nullable = false)
	private String url;
}
