package hcmute.kltn.Backend.model.tour.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourSearch {
	private String keyword;
	private String province;
	private String city;
	private String district;
	private String commune;
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private LocalDate startDate;
	private int numberOfPeople;
}
