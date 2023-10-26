package hcmute.kltn.Backend.model.z_enterprise.hotel.dto.extend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
	private String roomId;
	private int capacity;
	private int price;
	private boolean status;
}
