package hcmute.kltn.Backend.model.order.dto.extend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerInformation {
	private String fullName;
	private String email;
	private String phoneNumber;
}
