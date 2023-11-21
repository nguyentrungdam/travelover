package hcmute.kltn.Backend.model.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentCreate {
	private int amount;
	private String bankCode;
	private String language;
	private String orderInfo;
	private String orderType;
}
