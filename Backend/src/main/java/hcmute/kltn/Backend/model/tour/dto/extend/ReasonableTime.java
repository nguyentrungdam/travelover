package hcmute.kltn.Backend.model.tour.dto.extend;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReasonableTime {
	@JsonFormat(pattern = "dd/MM")
	private Date startDate;
	@JsonFormat(pattern = "dd/MM")
	private Date endDate;
}
