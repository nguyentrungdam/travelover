package hcmute.kltn.Backend.model.email.service.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.dto.AccountDTO;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.email.dto.EmailDTO;
import hcmute.kltn.Backend.model.email.service.IEmailService;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;
import hcmute.kltn.Backend.model.order.dto.extend.HotelDetail;

@Service
public class EmailService implements IEmailService{
	@Autowired 
	private JavaMailSender javaMailSender;
	@Autowired
	private IAccountService iAccountService;
	
	@Value("${spring.mail.username}") 
	private String sender;
	
	private void test() {
		String test = "<!DOCTYPE html>\r\n"
				+ "<html>\r\n"
				+ "<head>\r\n"
				+ "    <title>Hóa đơn bán hàng</title>\r\n"
				+ "    <style>\r\n"
				+ "        .invoice-box {\r\n"
				+ "            max-width: 600px;\r\n"
				+ "            margin: auto;\r\n"
				+ "            padding: 30px;\r\n"
				+ "            font-size: .875rem;\r\n"
				+ "            line-height: 24px;\r\n"
				+ "            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;\r\n"
				+ "            \r\n"
				+ "      \r\n"
				+ "        }\r\n"
				+ "        table {\r\n"
				+ "            width: 100%;\r\n"
				+ "            border-collapse: collapse;\r\n"
				+ "            table-layout: fixed;\r\n"
				+ "        }\r\n"
				+ "        th, td {\r\n"
				+ "            border: none; /* Ẩn đường viền */\r\n"
				+ "            padding: 8px;\r\n"
				+ "            text-align: left;\r\n"
				+ "            font-weight: normal;\r\n"
				+ "        }\r\n"
				+ "		\r\n"
				+ "		.item-img {\r\n"
				+ "			margin-top: 0;\r\n"
				+ "			height: 150px;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.block-logo {\r\n"
				+ "			text-align: center;\r\n"
				+ "			margin-bottom: 30px;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.logo{\r\n"
				+ "			margin: 0;\r\n"
				+ "			color: #436eee;\r\n"
				+ "			font-weight: bold;\r\n"
				+ "			font-size: 28px;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.btn {\r\n"
				+ "			text-align: center;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.button {\r\n"
				+ "			background-color: #436eee;\r\n"
				+ "			width: 150px;\r\n"
				+ "			color: #FFFFFF;\r\n"
				+ "			font-size: 14px;\r\n"
				+ "			padding: 10px;\r\n"
				+ "			border-radius: 4px;\r\n"
				+ "			text-decoration: none;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.button a {\r\n"
				+ "			color: #FFFFFF;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.button:hover {\r\n"
				+ "			background-color: #3558be;\r\n"
				+ "		}\r\n"
				+ "    </style>\r\n"
				+ "</head>\r\n"
				+ "<body>\r\n"
				+ "    <div class=\"invoice-box\">\r\n"
				+ "		<div class=\"block-logo\">\r\n"
				+ "			<p class=\"logo\">TRAVELOVER</p> \r\n"
				+ "		</div>\r\n"
				+ "		\r\n"
				+ "		<p>Xin chào [tên tài khoản].</p>\r\n"
				+ "		<p>Đơn hàng <span style=\"color: #436eee;\">[id]</span> của bạn đã được đặt thành công ngày [ngày hôm nay].</p>\r\n"
				+ "		<div class=\"btn\">\r\n"
				+ "			<a class=\"button\" href=\"https://drive.google.com/file/d/1RpOxkIjgATDdlxbtiVqj4vNprTorZhWK/view?usp=sharing\" style=\"color: #FFFFFF;\">Chi tiết đơn hàng</a>\r\n"
				+ "		</div>\r\n"
				+ "		\r\n"
				+ "        <h3>THÔNG TIN ĐƠN HÀNG</h3>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Mã đơn hàng:</th>\r\n"
				+ "                <th><span style=\"color: #436eee;\">[id]</span></th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Ngày đặt hàng:</th>\r\n"
				+ "                <th>[ngày hôm nay]</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <p>Khách hàng</p>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Tên người đặt:</th>\r\n"
				+ "                <th>[Full name]</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Số điện thoại:</th>\r\n"
				+ "                <th>[Phone number]</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Số người lớn:</th>\r\n"
				+ "                <th>[number of adult]</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Số trẻ em:</th>\r\n"
				+ "                <th>[number of children]</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <img class=\"item-img\" src=\"https://th.bing.com/th/id/R.cacf2bd1c7a1bd05586301e49b0acc50?rik=8%2fqFSqnfOfPuwQ&riu=http%3a%2f%2fwwwnc.cdc.gov%2ftravel%2fimages%2ftravel-industry-air.jpg&ehk=KJKAlgrvTGmg2OgSI1Zs3jpyaeYaBMu6r5GBA1AvGYc%3d&risl=&pid=ImgRaw&r=0\" alt=\"tour-thumbnail\"></img>\r\n"
				+ "        <p>[title tour]</p>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Thời gian:</th>\r\n"
				+ "                <th>[số ngày] ngày, [số đêm] đêm</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <p>Khách sạn: [count room] phòng</p>\r\n"
				+ "        <table>\r\n"
				+ "			<!-- begin for -->\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Phòng [capacity] người:</th>\r\n"
				+ "                <th>[số lượng] phòng</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <!-- end for -->\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <hr>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Tổng tiền:</th>\r\n"
				+ "                <th>[total price]đ</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Giảm giá:</th>\r\n"
				+ "                <th>-[discount]đ</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <hr>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Tổng thanh toán:</th>\r\n"
				+ "                <th>[final price]</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Đã thanh toán:</th>\r\n"
				+ "                <th>[discount.amount]</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "\r\n"
				+ "        <hr>\r\n"
				+ "        \r\n"
				+ "        <h3>BƯỚC TIẾP THEO</h3>\r\n"
				+ "        <p>Hãy đảm bảo rằng bạn đã chuẩn bị đầy đủ các vật dụng cần thiết cho chuyến du lịch sắp tới.</p>\r\n"
				+ "        <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi cho chuyến du lịch sắp tới của bạn. Chúng tôi rất hân hạnh được phục vụ bạn.</p>\r\n"
				+ "        <p>Chúc bạn có một chuyến du lịch vui vẻ và trọn vẹn.</p>\r\n"
				+ "        <br>\r\n"
				+ "        \r\n"
				+ "        <p>Trân trọng,</p>\r\n"
				+ "        <p>Đội ngũ Travelover</p>\r\n"
				+ "        \r\n"
				+ "        <br>\r\n"
				+ "        <p>Bạn có thắc mắc? Liên hệ chúng tôi <a href=\"https://drive.google.com/file/d/1K1GGav53I5sX8iiTPkLJWMh4R4_PD_XY/view?usp=sharing\">[tại đây]</a> .</p>\r\n"
				+ "        \r\n"
				+ "    </div>\r\n"
				+ "</body>\r\n"
				+ "</html>\r\n"
				+ "";
	}
	
	@Override
	public void sendSimpleMail(EmailDTO emailDTO) {
		// Try block to check for exceptions
        try {
 
            // Creating a simple mail message
            SimpleMailMessage mailMessage = new SimpleMailMessage();
 
            // Setting up necessary details
            mailMessage.setFrom("Travelover <" + sender + ">");
            mailMessage.setTo(emailDTO.getTo());
            mailMessage.setText(emailDTO.getContent());
            mailMessage.setSubject(emailDTO.getSubject());
 
            // Sending the mail
            javaMailSender.send(mailMessage);
        }
        
        // Catch block to handle the exceptions
        catch (Exception e) {
        	throw new CustomException("Error while Sending Mail: + " + e.getMessage());
        }
	}

	@Override
	public void sendSimpleMailWithAttachment(EmailDTO emailDTO, MultipartFile file) {
		// Creating a mime message
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;
 
        try {
 
            // Setting multipart as true for attachments to
            // be send
            mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom("Travelover <" + sender + ">");
            mimeMessageHelper.setTo(emailDTO.getTo());
            mimeMessageHelper.setText(emailDTO.getContent());
            mimeMessageHelper.setSubject(emailDTO.getSubject());
            mimeMessageHelper.addAttachment(file.getOriginalFilename(), file);
 
            // Sending the mail
            javaMailSender.send(mimeMessage);
        }
 
        // Catch block to handle MessagingException
        catch (MessagingException e) {
        	throw new CustomException("Error while Sending Mail with attachment: + " + e.getMessage());
        }
	}

	@Override
	public void sendMail(EmailDTO emailDTO) {
        try {
        	// Creating a mime message
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            
            mimeMessage.setFrom("Travelover <" + sender + ">");
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(emailDTO.getTo()));
            mimeMessage.setSubject(emailDTO.getSubject(), "UTF-8");
            mimeMessage.setContent(emailDTO.getContent(), "text/html; charset=UTF-8");

            // Sending the mail
            javaMailSender.send(mimeMessage);
        }
 
        // Catch block to handle MessagingException
        catch (MessagingException e) {
        	throw new CustomException("Error while Sending Mail with attachment: + " + e.getMessage());
        }
	}

	@Override
	public EmailDTO getInfoOrderSuccess(OrderDTO orderDTO, String accountId) {
		String orderId = orderDTO.getOrderId();
		
		AccountDTO accountDTO = new AccountDTO();
		accountDTO = iAccountService.getDetailAccount(accountId);
		String accountName = accountDTO.getFirstName();
		
		String orderDate = orderDTO.getCreatedAt().toString();
		String fullName = orderDTO.getCustomerInformation().getFullName();
		String phoneNumber = orderDTO.getCustomerInformation().getPhoneNumber();
		String numberOfAdult = String.valueOf(orderDTO.getNumberOfAdult());
		String numberOfChildren = String.valueOf(orderDTO.getNumberOfChildren());
		String tourThumbnail = orderDTO.getOrderDetail().getTourDetail().getThumbnailUrl();
		String tourTitle = orderDTO.getOrderDetail().getTourDetail().getTourTitle();
		String numberOfDay = String.valueOf(orderDTO.getOrderDetail().getTourDetail().getNumberOfDay());
		String numberOfNight = String.valueOf(orderDTO.getOrderDetail().getTourDetail().getNumberOfNight());
		
		// get room
		List<HotelDetail> hotelDetailList = orderDTO.getOrderDetail().getHotelDetail();
		String numberOfRoom = String.valueOf(hotelDetailList.size());
		String roomList = "";
		
		HashMap<Integer, Integer> countRoom = new HashMap<>();
		for (HotelDetail itemHotelDetail : hotelDetailList) {
			HashMap<Integer, Integer> countRoomClone = new HashMap<>();
			countRoomClone.putAll(countRoom);
			for (Map.Entry<Integer, Integer> itemCountRoomClone : countRoomClone.entrySet()) {
				Integer key = itemCountRoomClone.getKey();
				Integer value = itemCountRoomClone.getValue();
				
				if (itemHotelDetail.getCapacity() == key) {
					countRoom.replace(key, value + 1);
					break;
				}
			}
			
			if (countRoom.equals(countRoomClone)) {
				countRoom.put(itemHotelDetail.getCapacity(), 1);
			}
		}
		
		for (Map.Entry<Integer, Integer> itemCountRoom : countRoom.entrySet()) {
			Integer key = itemCountRoom.getKey();
			Integer value = itemCountRoom.getValue();
			
			String room = ""
					+ "			   <!-- begin for -->\r\n"
					+ "            <tr>\r\n"
					+ "                <th>Phòng " + key + " người:</th>\r\n"
					+ "                <th>" + value + " phòng</th>\r\n"
					+ "            </tr>\r\n"
					+ "            <!-- end for -->\r\n";
			roomList += room;
		}
		
		String totalPrice = String.valueOf(orderDTO.getTotalPrice());
		String discountPrice = String.valueOf(orderDTO.getDiscount().getDiscountCodeValue());
		String finalPrice = String.valueOf(orderDTO.getFinalPrice());
		
		String paid = "0";
		if (orderDTO.getPayment().size() > 0) {
			paid = String.valueOf(orderDTO.getPayment().get(0).getAmount());
		}
		
		String subject = "Đơn hàng " + orderId + " đã đặt thành công";
		
		String imageUrlTest = "https://th.bing.com/th/id/R.cacf2bd1c7a1bd05586301e49b0acc50?rik=8%2fqFSqnfOfPuwQ&riu=http%3a%2f%2fwwwnc.cdc.gov%2ftravel%2fimages%2ftravel-industry-air.jpg&ehk=KJKAlgrvTGmg2OgSI1Zs3jpyaeYaBMu6r5GBA1AvGYc%3d&risl=&pid=ImgRaw&r=0";
		
		String html = "<!DOCTYPE html>\r\n"
				+ "<html>\r\n"
				+ "<head>\r\n"
				+ "    <title>Hóa đơn bán hàng</title>\r\n"
				+ "    <style>\r\n"
				+ "        .invoice-box {\r\n"
				+ "            max-width: 600px;\r\n"
				+ "            margin: auto;\r\n"
				+ "            padding: 30px;\r\n"
				+ "            font-size: .875rem;\r\n"
				+ "            line-height: 24px;\r\n"
				+ "            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;\r\n"
				+ "            \r\n"
				+ "      \r\n"
				+ "        }\r\n"
				+ "        table {\r\n"
				+ "            width: 100%;\r\n"
				+ "            border-collapse: collapse;\r\n"
				+ "            table-layout: fixed;\r\n"
				+ "        }\r\n"
				+ "        th, td {\r\n"
				+ "            border: none; /* Ẩn đường viền */\r\n"
				+ "            padding: 8px;\r\n"
				+ "            text-align: left;\r\n"
				+ "            font-weight: normal;\r\n"
				+ "        }\r\n"
				+ "		\r\n"
				+ "		.item-img {\r\n"
				+ "			margin-top: 0;\r\n"
				+ "			height: 150px;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.block-logo {\r\n"
				+ "			text-align: center;\r\n"
				+ "			margin-bottom: 30px;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.logo{\r\n"
				+ "			margin: 0;\r\n"
				+ "			color: #436eee;\r\n"
				+ "			font-weight: bold;\r\n"
				+ "			font-size: 28px;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.btn {\r\n"
				+ "			text-align: center;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.button {\r\n"
				+ "			background-color: #436eee;\r\n"
				+ "			width: 150px;\r\n"
				+ "			color: #FFFFFF;\r\n"
				+ "			font-size: 14px;\r\n"
				+ "			padding: 10px;\r\n"
				+ "			border-radius: 4px;\r\n"
				+ "			text-decoration: none;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.button a {\r\n"
				+ "			color: #FFFFFF;\r\n"
				+ "		}\r\n"
				+ "		\r\n"
				+ "		.button:hover {\r\n"
				+ "			background-color: #3558be;\r\n"
				+ "		}\r\n"
				+ "    </style>\r\n"
				+ "</head>\r\n"
				+ "<body>\r\n"
				+ "    <div class=\"invoice-box\">\r\n"
				+ "		<div class=\"block-logo\">\r\n"
				+ "			<p class=\"logo\">TRAVELOVER</p> \r\n"
				+ "		</div>\r\n"
				+ "		\r\n"
				+ "		<p>Xin chào " + accountName + ".</p>\r\n"
				+ "		<p>Đơn hàng <span style=\"color: #436eee;\">" + orderId + "</span> của bạn đã được đặt thành công ngày " + orderDate + ".</p>\r\n"
				+ "		<div class=\"btn\">\r\n"
				+ "			<a class=\"button\" href=\"https://drive.google.com/file/d/1RpOxkIjgATDdlxbtiVqj4vNprTorZhWK/view?usp=sharing\" style=\"color: #FFFFFF;\">Chi tiết đơn hàng</a>\r\n"
				+ "		</div>\r\n"
				+ "		\r\n"
				+ "        <h3>THÔNG TIN ĐƠN HÀNG</h3>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Mã đơn hàng:</th>\r\n"
				+ "                <th><span style=\"color: #436eee;\">" + orderId + "</span></th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Ngày đặt hàng:</th>\r\n"
				+ "                <th>" + orderDate + "</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <p>Khách hàng</p>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Tên người đặt:</th>\r\n"
				+ "                <th>" + fullName + "</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Số điện thoại:</th>\r\n"
				+ "                <th>" + phoneNumber + "</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Số người lớn:</th>\r\n"
				+ "                <th>" + numberOfAdult + "</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Số trẻ em:</th>\r\n"
				+ "                <th>" + numberOfChildren + "</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <img class=\"item-img\" src=\"" + imageUrlTest + "\" alt=\"tour-thumbnail\"></img>\r\n"
				+ "        <p>" + tourTitle + "</p>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Thời gian:</th>\r\n"
				+ "                <th>" + numberOfDay + " ngày, " + numberOfNight + " đêm</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <p>Khách sạn: " + numberOfRoom + " phòng</p>\r\n"
				+ "        <table>\r\n"
				+ roomList
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <hr>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Tổng tiền:</th>\r\n"
				+ "                <th>" + totalPrice + "đ</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Giảm giá:</th>\r\n"
				+ "                <th>-" + discountPrice + "đ</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "        \r\n"
				+ "        <hr>\r\n"
				+ "        <table>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Tổng thanh toán:</th>\r\n"
				+ "                <th>" + finalPrice + "</th>\r\n"
				+ "            </tr>\r\n"
				+ "            <tr>\r\n"
				+ "                <th>Đã thanh toán:</th>\r\n"
				+ "                <th>" + paid + "</th>\r\n"
				+ "            </tr>\r\n"
				+ "        </table>\r\n"
				+ "\r\n"
				+ "        <hr>\r\n"
				+ "        \r\n"
				+ "        <h3>BƯỚC TIẾP THEO</h3>\r\n"
				+ "        <p>Hãy đảm bảo rằng bạn đã chuẩn bị đầy đủ các vật dụng cần thiết cho chuyến du lịch sắp tới.</p>\r\n"
				+ "        <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi cho chuyến du lịch sắp tới của bạn. Chúng tôi rất hân hạnh được phục vụ bạn.</p>\r\n"
				+ "        <p>Chúc bạn có một chuyến du lịch vui vẻ và trọn vẹn.</p>\r\n"
				+ "        <br>\r\n"
				+ "        \r\n"
				+ "        <p>Trân trọng,</p>\r\n"
				+ "        <p>Đội ngũ Travelover</p>\r\n"
				+ "        \r\n"
				+ "        <br>\r\n"
				+ "        <p>Bạn có thắc mắc? Liên hệ chúng tôi <a href=\"https://drive.google.com/file/d/1K1GGav53I5sX8iiTPkLJWMh4R4_PD_XY/view?usp=sharing\">[tại đây]</a> .</p>\r\n"
				+ "        \r\n"
				+ "    </div>\r\n"
				+ "</body>\r\n"
				+ "</html>\r\n"
				+ "";
		
		EmailDTO emailDTO = new EmailDTO();
		emailDTO.setSubject(subject);
		emailDTO.setContent(html);

		return emailDTO;
	}
}
