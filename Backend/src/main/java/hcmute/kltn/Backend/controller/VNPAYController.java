package hcmute.kltn.Backend.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.payment.dto.PaymentCreate;
import hcmute.kltn.Backend.model.payment.service.IPaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/vnpay")
@Tag(name = "VNPAY", description = "APIs for managing vnpay")
@SecurityRequirement(name = "Bearer Authentication")
public class VNPAYController {
	@Autowired
	private IResponseObjectService iResponseObjectService;
	@Autowired
	private IPaymentService iPaymentService;
	
	@Value("${vnp.PayUrl}")
    private String payUrl;
    @Value("${vnp.ReturnUrl}")
    private String returnUrl;
    @Value("${vnp.TmnCode}")
    private String tmnCode;
    @Value("${vnp.secretKey}")
    private String secretKey;
    @Value("${vnp.ApiUrl}")
    private String apiUrl;
	
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Operation(summary = "Create payment")
//	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
	ResponseEntity<ResponseObject> createPayment(
			@RequestParam("amount") int orderTotal,
            @RequestParam("orderInfo") String orderInfo,
            @RequestParam("returnUrl") String returnUrl) {
        String vnpayUrl = iPaymentService.createOrder(orderTotal, orderInfo, returnUrl);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create payment successfully");
				setData(vnpayUrl);
			}
		});
	}
}
