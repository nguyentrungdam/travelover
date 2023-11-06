package hcmute.kltn.Backend.model.z_enterprise.eHotel.dto.extend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetail {
	private String roomId;
	private int capacity;
	private int price;
}
