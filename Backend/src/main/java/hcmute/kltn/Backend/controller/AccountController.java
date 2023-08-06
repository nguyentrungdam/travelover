package hcmute.kltn.Backend.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.ResponseObject;
import hcmute.kltn.Backend.model.dto.AccountUpdateProfile;
import hcmute.kltn.Backend.model.dto.AuthRequest;
import hcmute.kltn.Backend.model.dto.AuthResponse;
import hcmute.kltn.Backend.model.dto.RegisterRequest;
import hcmute.kltn.Backend.model.entity.Account;
import hcmute.kltn.Backend.service.AccountDetailsService;
import hcmute.kltn.Backend.service.intf.IAccountService;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/accounts")
@Tag(name = "Accounts", description = "APIs for managing accounts")
@SecurityRequirement(name = "Bearer Authentication")
public class AccountController {
	@Autowired
	private IAccountService iAccountService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	@Autowired
	private AccountDetailsService accountDetailsService;
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@Operation(summary = "Login Account")
	ResponseEntity<ResponseObject> login(@RequestBody @Valid AuthRequest request) {
		AuthResponse response = iAccountService.login(request);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Login successfully");
				setCountData(1);
				setData(response);
			}
		});
	}

	@RequestMapping(value = "/register", method = RequestMethod.POST)
	@Operation(summary = "Register Account")
	ResponseEntity<ResponseObject> register(@RequestBody RegisterRequest registerRequest) {
		Account account =  iAccountService.register(registerRequest);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Create Account successfully");
				setData(account);
			}
		});
	}
	
	private final String updateAccountDescription = "Update theo toàn bộ thông tin được nhập từ updateAccountRequest\n\n"
			+ "Chỉ cần tạo 1 form-data bao gồm cả file và các field nằm trong updateAccountRequest\n\n"
			+ "Ví dụ:\n\n"
			+ "- 'file': file hình ảnh\n"
			+ "- 'fistName': text\n"
			+ "- 'lastName': text\n"
			+ "- ...\n\n"
			+ "Để xóa hình ảnh avatar có sẵn thì xóa luôn field avatar";
	@RequestMapping(value = "/profile/update", method = RequestMethod.PUT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Update Account - LOGIN", description = updateAccountDescription)
	@PreAuthorize("isAuthenticated()")
	@ModelAttribute
	ResponseEntity<ResponseObject> updateProfile(
			@RequestParam(required = false) MultipartFile fileAvatar,
			AccountUpdateProfile updateAccountRequest) {
		Account account = iAccountService.updateProfile(fileAvatar, updateAccountRequest);
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Update Account successfully");
				setData(account);
			}
		});
	}
	
	@RequestMapping(value = "/profile/detail", method = RequestMethod.GET)
	@Operation(summary = "Get profile Account - LOGIN")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> getProfile() {
		Account account = accountDetailsService.getCurrentAccount();
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Query Account successfully");
				setData(account);
			}
		});
	}

//	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
//	@Operation(summary = "Delete Account")
//	ResponseEntity<ResponseObject> deleteAccount(@PathVariable String id) {
//		boolean delete = iUserService.delete(id);
//		
//		return iResponseObjectService.success(new ResponseObject() {
//			{
//				setMessage("Delete Account successfully");
//			}});
//	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(summary = "Get all Account - SUPER_ADMIN")
	@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
	ResponseEntity<ResponseObject> getAllAccounts() {
		List<Account> accountList = iAccountService.getAll();
		
		return iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Get all Accounts");
				setCountData(accountList.size());
				setData(accountList);
			}
		});
	}
}
