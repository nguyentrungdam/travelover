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

import hcmute.kltn.Backend.model.account.dto.AccountUpdateProfile;
import hcmute.kltn.Backend.model.account.dto.AuthRequest;
import hcmute.kltn.Backend.model.account.dto.AuthResponse;
import hcmute.kltn.Backend.model.account.dto.RegisterRequest;
import hcmute.kltn.Backend.model.account.dto.entity.Account;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.account.service.impl.AccountDetailsService;
import hcmute.kltn.Backend.model.base.response.dto.Response;
import hcmute.kltn.Backend.model.base.response.dto.ResponseObject;
import hcmute.kltn.Backend.model.base.response.service.IResponseObjectService;
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
	ResponseEntity<ResponseObject> login(@RequestBody AuthRequest request) {
		AuthResponse response = iAccountService.login(request);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Login successfully");
				setData(response);
			}
		});
	}

	@RequestMapping(value = "/register", method = RequestMethod.POST)
	@Operation(summary = "Register Account")
	ResponseEntity<ResponseObject> register(@RequestBody RegisterRequest registerRequest) {
		Account account =  iAccountService.register(registerRequest);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Create Account successfully");
				setData(account);
			}
		});
	}
	
	@RequestMapping(value = "/profile/update", method = RequestMethod.PUT)
	@Operation(summary = "Update Account - LOGIN")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> updateProfile(
			@RequestBody AccountUpdateProfile updateAccountRequest) {
		Account account = iAccountService.updateProfile(updateAccountRequest);
		
		return iResponseObjectService.success(new Response() {
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
		Account account = iAccountService.getProfile();
		
		return iResponseObjectService.success(new Response() {
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
//		return iResponseObjectService.success(new Response() {
//			{
//				setMessage("Delete Account successfully");
//			}});
//	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@Operation(summary = "Get all Account - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	ResponseEntity<ResponseObject> getAllAccounts() {
		List<Account> accountList = iAccountService.getAllAccount();
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Get all Accounts");
				setData(accountList);
			}
		});
	}
	
	@RequestMapping(value = "/search", method = RequestMethod.GET)
	@Operation(summary = "Search Account by keyword - ADMIN")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	ResponseEntity<ResponseObject> getProfile(@RequestParam String keyword) {
		List<Account> accountList = iAccountService.searchAccount(keyword);
		
		return iResponseObjectService.success(new Response() {
			{
				setMessage("Search Account successfully");
				setData(accountList);
			}
		});
	}
}
