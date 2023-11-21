package hcmute.kltn.Backend.model.payment.service;

public interface IPaymentService {
	 public String createOrder(int total, String orderInfor, String urlReturn);
}
