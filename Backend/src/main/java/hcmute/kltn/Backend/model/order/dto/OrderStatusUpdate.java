package hcmute.kltn.Backend.model.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusUpdate {
	private String orderId;
	private String status;
	private String message;
	private String discountCode;
}
