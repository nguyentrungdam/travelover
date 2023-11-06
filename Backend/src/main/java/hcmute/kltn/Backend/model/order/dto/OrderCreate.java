package hcmute.kltn.Backend.model.order.dto;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import hcmute.kltn.Backend.model.order.dto.extend.CustomerInformation;
import hcmute.kltn.Backend.model.order.dto.extend.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreate {
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private LocalDate startDate; // not null
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private LocalDate endDate; // not null
	private List<OrderDetail> orderDetail;
	private CustomerInformation customerInformation; // not null
	private int numberOfChildren; // not null
	private int numberOfAdult; // not null
	private String note;
}
