package hcmute.kltn.Backend.model.order.dto.entity;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import hcmute.kltn.Backend.model.base.BaseEntity;
import hcmute.kltn.Backend.model.order.dto.extend.CustomerInformation;
import hcmute.kltn.Backend.model.order.dto.extend.Discount;
import hcmute.kltn.Backend.model.order.dto.extend.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Document(collection = "order")
@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order extends BaseEntity{
	@Id
	private String orderId;
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private LocalDate startDate; // not null
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private LocalDate endDate; // not null
	private OrderDetail orderDetail;
	private CustomerInformation customerInformation; // not null
	private int numberOfChildren; // not null
	private int numberOfAdult; // not null
	private String note;
//	private int price; // not null
	private List<Discount> discount;
	private int totalPrice; // not null
	private String paymentStatus; 
	private String orderStatus; 
}
