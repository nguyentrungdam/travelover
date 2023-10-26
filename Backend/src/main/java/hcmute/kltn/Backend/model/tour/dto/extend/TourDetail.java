package hcmute.kltn.Backend.model.tour.dto.extend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourDetail {
	private int day;
	private String description;
	private String imageUrl;
	private int price;
}
