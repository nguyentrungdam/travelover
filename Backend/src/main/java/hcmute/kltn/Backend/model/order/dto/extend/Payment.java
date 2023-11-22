package hcmute.kltn.Backend.model.order.dto.extend;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
	private String method;
	private String transactionCode;
	private int amount;
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private LocalDate date;
}
