package hcmute.kltn.Backend.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmute.kltn.Backend.model.dto.AuthRequest;
import hcmute.kltn.Backend.model.dto.RegisterRequest;
import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.model.dto.UpdateAccountRequest;
import hcmute.kltn.Backend.model.entity.Account;
import hcmute.kltn.Backend.service.intf.IAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(path = "/api/v1/accounts")
@Tag(name = "Accounts", description = "APIs for managing accounts")
@SecurityRequirement(name = "Bearer Authentication")
public class AccountController {
	@Autowired
	private IAccountService iUserService;
	
	@PostMapping("/login")
	@Operation(summary = "Login Account")
	ResponseEntity<ResponseObject> login(@RequestBody @Valid AuthRequest request) {
		return iUserService.login(request);
	}

	@PostMapping("/register")
	@Operation(summary = "Register Account")
	ResponseEntity<ResponseObject> register(@RequestBody RegisterRequest registerRequest) {
		return iUserService.register(registerRequest);
	}
	

	@PutMapping("/update/{id}")
	@Operation(summary = "Update Account")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> updateAccount(@RequestBody UpdateAccountRequest updateAccountRequest) {
		return iUserService.updateAccount(updateAccountRequest);
	}
	
	@GetMapping("/profile/{id}")
	@Operation(summary = "Get profile Account")
	@PreAuthorize("isAuthenticated()")
	ResponseEntity<ResponseObject> getProfile() {
		return iUserService.getDetailAccount();
	}

//	@DeleteMapping("/delete/{id}")
//	@Operation(summary = "Delete Account")
//	ResponseEntity<ResponseObject> deleteAccount(@PathVariable String id) {
//		return iUserService.deleteAccount(id);
//	}

	@GetMapping("/list")
	@Operation(summary = "Get all Account")
	@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
	ResponseEntity<ResponseObject> getAllAccounts() {
		return iUserService.getAllAccount();
	}
}
