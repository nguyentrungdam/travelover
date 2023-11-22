package hcmute.kltn.Backend.model.payment.vnpay.service;

import javax.servlet.http.HttpServletRequest;

import hcmute.kltn.Backend.model.payment.vnpay.dto.VNPayCreate;

public interface IVNPayService {
	 public String createPayment(VNPayCreate vnPayCreate, String ipAddress);
	 public int checkPayment(HttpServletRequest request);
}
