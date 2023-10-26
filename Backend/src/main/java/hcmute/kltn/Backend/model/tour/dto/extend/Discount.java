package hcmute.kltn.Backend.model.tour.dto.extend;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Discount {
	private Date startDate;
	private Date endDate;
	private int discountValue;
	private boolean auto;
	private boolean status;
}
