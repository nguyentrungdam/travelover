package hcmute.kltn.Backend.model.email.service.impl;

import java.io.File;

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
import hcmute.kltn.Backend.model.email.dto.EmailDTO;
import hcmute.kltn.Backend.model.email.service.IEmailService;
import hcmute.kltn.Backend.model.order.dto.OrderDTO;

@Service
public class EmailService implements IEmailService{
	@Autowired 
	private JavaMailSender javaMailSender;
	
	@Value("${spring.mail.username}") 
	private String sender;
	
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
	public String getHTMLOrderSuccess(OrderDTO orderDTO) {


		return null;
	}
}
