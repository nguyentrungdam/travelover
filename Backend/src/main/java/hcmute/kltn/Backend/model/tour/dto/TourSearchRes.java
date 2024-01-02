package hcmute.kltn.Backend.model.tour.dto;

import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.model.tour.dto.extend.Hotel;
import hcmute.kltn.Backend.model.tour.dto.extend.OneVehicle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourSearchRes {
	private Tour tour;
	private Hotel hotel;
	private OneVehicle vehicle;
	private int totalPriceNotDiscount;
	private int totalPrice;
}
