package hcmute.kltn.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
import hcmute.kltn.Backend.model.email.dto.EmailDTO;
import hcmute.kltn.Backend.model.email.service.IEmailService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/emails")
@Tag(name = "Emails", description = "APIs for managing emails")
@SecurityRequirement(name = "Bearer Authentication")
public class EmailController {
	@Autowired 
	private IEmailService iEmailService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	
	@RequestMapping(value = "/send", method = RequestMethod.POST)
	@Operation(summary = "Send email - ADMIN / STAFF")
	@PreAuthorize("hasAnyRole('ROLE_STAFF')")
	ResponseEntity<ResponseObject> sendEmail(
			@RequestBody EmailDTO emailDTO) {
		iEmailService.sendMail(emailDTO);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Send Email successfully");
			}
		});
	}
	
//	@RequestMapping(value = "/send-simple", method = RequestMethod.POST)
//	@Operation(summary = "Send simple email - ADMIN / STAFF")
//	@PreAuthorize("hasAnyRole('ROLE_STAFF')")
//	ResponseEntity<ResponseObject> sendSimpleMail(
//			@RequestBody EmailDTO emailDTO) {
//		iEmailService.sendSimpleMail(emailDTO);
//		
//		return iResponseObjectService.success(new Response() {
//			{
//				setMessage("Send simple Email successfully");
//			}
//		});
//	}
//	
//	@RequestMapping(value = "/send-simple-with-attachment", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	@Operation(summary = "Send email with attachment - ADMIN / STAFF")
//	@PreAuthorize("hasAnyRole('ROLE_STAFF')")
//	ResponseEntity<ResponseObject> sendSimpleMailWithAttachment(
//			@ModelAttribute MultipartFile file,
//			EmailDTO emailDTO) {
//		iEmailService.sendSimpleMailWithAttachment(emailDTO, file);
//		
//		return iResponseObjectService.success(new Response() {
//			{
//				setMessage("Send Email with attachment successfully");
//			}
//		});
//	}
	
	
}
