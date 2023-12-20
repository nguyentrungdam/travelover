package hcmute.kltn.Backend.controller;

import java.io.IOException;
import java.time.LocalDate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.account.dto.AccountDTO;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.email.dto.EmailDTO;
import hcmute.kltn.Backend.model.email.service.IEmailService;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;
import hcmute.kltn.Backend.model.order.dto.OrderPaymentUpdate;
import hcmute.kltn.Backend.model.order.service.IOrderService;
import hcmute.kltn.Backend.model.payment.vnpay.dto.VNPayCreate;
import hcmute.kltn.Backend.model.payment.vnpay.service.IVNPayService;
import hcmute.kltn.Backend.util.LocalDateUtil;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/payments")
@Tag(
		name = "Payments", 
		description = "APIs for managing payments\n\n",
		externalDocs = @ExternalDocumentation(
				description = "Update Api History", 
				url = "https://drive.google.com/file/d/1aCMrABRUkr3Cdg_s_bIsH_-ZcJz3YskL/view?usp=sharing")
		)
@SecurityRequirement(name = "Bearer Authentication")
public class PaymentController {
	@Autowired
	private IResponseObjectService iResponseObjectService;
	@Autowired
	private IVNPayService iVNPayService;
	@Autowired
	private IOrderService iOrderService;
	@Autowired
	private IEmailService iEmailService;
	@Autowired
	private IAccountService iAccountService;
	
	@RequestMapping(value = "/vnpay/forward", method = RequestMethod.GET)
    public void processData(HttpServletResponse response, HttpServletRequest request
    		) throws IOException {
		
		String transactionCode = request.getParameter("vnp_TransactionNo");
		int amout = Integer.valueOf(request.getParameter("vnp_Amount")) / 100;
		String orderInfo = request.getParameter("vnp_OrderInfo");
		
		String[] orderInfoSplit = orderInfo.split("/", 2);
		String orderId = orderInfoSplit[0];
		String redirectUrl = orderInfoSplit[1];
		
		LocalDate dateNow = LocalDateUtil.getDateNow();

		// check payment status
		int checkPayment = iVNPayService.checkPayment(request);
		if (checkPayment == 1) {
			// update order
			OrderPaymentUpdate prderPaymentUpdate = new OrderPaymentUpdate();
			prderPaymentUpdate.setOrderId(orderId);
			prderPaymentUpdate.setMethod("NVPay");
			prderPaymentUpdate.setTransactionCode(transactionCode);
			prderPaymentUpdate.setAmount(amout);
			
			iOrderService.updateOrderPayment(prderPaymentUpdate);
			
			// Send email 
			OrderDTO orderDTO = new OrderDTO();
			orderDTO = iOrderService.getDetailOrder(orderId);
			
			AccountDTO accountDTO = new AccountDTO();
			accountDTO = iAccountService.getDetailAccount(orderDTO.getCreatedBy());
			EmailDTO emailDTO = iEmailService.getInfoOrderSuccess(orderDTO, accountDTO.getFirstName());
			emailDTO.setTo(accountDTO.getEmail());
			iEmailService.sendMail(emailDTO);
			
			// send second mail if customer mail != account mail
			if (!orderDTO.getCustomerInformation().getEmail().equals(accountDTO.getEmail())) {
				EmailDTO emailDTO2 = iEmailService.getInfoOrderSuccess(orderDTO, orderDTO.getCustomerInformation().getFullName());
				emailDTO2.setTo(orderDTO.getCustomerInformation().getEmail());
				iEmailService.sendMail(emailDTO2);
			}
		}

        // Sau khi xử lý dữ liệu, chuyển hướng đến trang web
		String paymentStatus = String.valueOf(checkPayment);
        response.sendRedirect(redirectUrl + "?orderId=" + orderId);
//        		+ "?paymentStatus=" + paymentStatus
//        		+ "&orderId=" + orderId);
    }
	
	private final String createVNPayPaymentDesc = "Các field bắt buộc phải nhập (Tạo Order trước để lấy các 2 field bên dưới):\n\n"
			+ "- 'amount': '' || totalPrice từ Order\n"
			+ "- 'orderInfo': '' || orderId từ Order\n"
			+ "- 'returnUrl': '' || Link sau khi thanh toán sẽ chuyển đến\n\n"
			+ "Tài khoản ngân hàng để test thử (chọn Thẻ nội địa và tài khoản ngân hàng -> chọn ngân hàng NCB):\n"
			+ "- Ngân hàng: NCB\n"
			+ "- Số thẻ: 9704198526191432198\n"
			+ "- Tên chủ thẻ: NGUYEN VAN A\n"
			+ "- Ngày phát hành: 07/15\n"
			+ "- Mật khẩu OTP: 123456";
	@RequestMapping(value = "/vnpay/create", method = RequestMethod.POST)
	@Operation(summary = "Create vnpay payment", description = createVNPayPaymentDesc)
//	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> createVNPayPayment(
			HttpServletRequest request,
			@RequestBody VNPayCreate vnPayCreate) {
		String ipAddress = request.getRemoteAddr();
        String vnpayUrl = iVNPayService.createPayment(vnPayCreate, ipAddress);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create vnpay payment successfully");
				setData(vnpayUrl);
			}
		});
	}
}
