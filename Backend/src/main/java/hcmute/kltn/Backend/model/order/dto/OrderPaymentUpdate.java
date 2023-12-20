package hcmute.kltn.Backend.model.order.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPaymentUpdate {
	private String orderId;
	private String method;
	private String transactionCode;
	private int amount;
}
