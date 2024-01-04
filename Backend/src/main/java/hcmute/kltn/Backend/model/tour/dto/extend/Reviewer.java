package hcmute.kltn.Backend.model.tour.dto.extend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reviewer {
	private String accountId;
	private String accountName;
	private String avatar;
	private int rate;
	private String comment;
}
