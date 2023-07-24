package hcmute.kltn.Backend.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.persistence.Table;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import hcmute.kltn.Backend.component.JwtTokenUtil;
import hcmute.kltn.Backend.model.dto.AuthRequest;
import hcmute.kltn.Backend.model.dto.AuthResponse;
import hcmute.kltn.Backend.model.dto.ERole;
import hcmute.kltn.Backend.model.dto.RegisterRequest;
import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.model.dto.UpdateAccountRequest;
import hcmute.kltn.Backend.model.entity.Account;
import hcmute.kltn.Backend.repository.AccountRepository;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;
import hcmute.kltn.Backend.service.intf.IResponseObjectService;
import hcmute.kltn.Backend.service.intf.IAccountService;

@Service
public class AccountService implements IAccountService{
	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private IResponseObjectService iResponseObjectService;
	@Autowired 
	private AuthenticationManager authManager;
    @Autowired 
    private JwtTokenUtil jwtUtil;
    @Autowired
    private ModelMapper modelMapper;

	private String tableName = Account.class.getAnnotation(Table.class).name();
	
	@Override
	public ResponseEntity<ResponseObject> login(AuthRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword())
            );
             
            User user = (User) authentication.getPrincipal();
            String accessToken = jwtUtil.generateAccessToken(user);
            AuthResponse response = new AuthResponse(user.getUsername(), accessToken);
             
            return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.success(new ResponseObject() {
				{
					setMessage("Login successfully");
					setCountData(1);
					setData(response);
				}
			}));
             
        } catch (BadCredentialsException ex) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(iResponseObjectService.failed(new ResponseObject() {
				{
					setMessage("Login successfully");
					setData(ex.toString());
				}
			}));
        }
    }

	@Override
	public ResponseEntity<ResponseObject> register(RegisterRequest registerRequest) {
		List<Account> listUser = accountRepository.findByEmail(registerRequest.getEmail().trim());

		if (listUser.size() > 0) {
			return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.failed(new ResponseObject() {
				{
					setMessage("Email is already");
				}
			}));
		} else {
			Account newAccount = new Account();
			modelMapper.map(registerRequest, newAccount);
			
			newAccount.setAccountId(iGeneratorSequenceService.genID(tableName));
			newAccount.setPassword(new BCryptPasswordEncoder().encode(registerRequest.getPassword()));
			
			boolean isRole = false;
			for (ERole item : ERole.values()) {
				if (item.name().equals(registerRequest.getRole())) {
					isRole = true;
					break;
				}
			}
			if (isRole == false) {
				return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.failed(new ResponseObject() {
					{
						setMessage("Role does not exist");
					}
				}));
			}
			
			newAccount.setCreatedBy("test");
			newAccount.setCreatedAt(new Date());
			newAccount.setLastModifiedBy("test");
			newAccount.setLastModifiedAt(new Date());
			
			return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.success(new ResponseObject() {
				{
					setMessage("Create Account successfully");
					setData(accountRepository.save(newAccount));
				}
			}));
		}
	}

	@Override
	public ResponseEntity<ResponseObject> updateAccount(UpdateAccountRequest updateAccountRequest) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String subject = authentication.getName();

		Optional<Account> foundAccount = accountRepository.findFirstByEmail(subject);
		
		Account newAccount = foundAccount.get();
		
		if (updateAccountRequest.getFirstName() != null) {
			newAccount.setFirstName(updateAccountRequest.getFirstName());
		}
		if (updateAccountRequest.getLastName() != null) {
			newAccount.setLastName(updateAccountRequest.getLastName());
		}
		if (updateAccountRequest.getPassword() != null) {
			String password = new BCryptPasswordEncoder().encode(updateAccountRequest.getPassword());
			newAccount.setPassword(password);
		}
		if (updateAccountRequest.getRole() != null) {
			newAccount.setRole(updateAccountRequest.getRole());
		}
		if (updateAccountRequest.getAvatar() != null) {
			newAccount.setAvatar(updateAccountRequest.getAvatar());
		}
		if (updateAccountRequest.getAddress() != null) {
			newAccount.setAddress(updateAccountRequest.getAddress());
		}
		if (updateAccountRequest.getPhoneNumber() != null) {
			newAccount.setPhoneNumber(updateAccountRequest.getPhoneNumber());
		}
		if (updateAccountRequest.getParentId() != null) {
			newAccount.setParentId(updateAccountRequest.getParentId());
		}

		return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Update Account successfully");
				setData(accountRepository.save(newAccount));
			}
		}));
	}

	@Override
	public ResponseEntity<ResponseObject> deleteAccount(String id) {
		boolean exists = accountRepository.existsById(id);
		if (exists) {
			return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.success(new ResponseObject() {
				{
					setMessage("Delete Account successfully");
				}
			}));
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(iResponseObjectService.failed(new ResponseObject() {
				{
					setMessage("Cannot find Account to delete");
				}
			}));
		}
	}

	@Override
	public ResponseEntity<ResponseObject> getDetailAccount() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String subject = authentication.getName();

		Optional<Account> foundAccount = accountRepository.findFirstByEmail(subject);
		
//		Optional<Account> foundUser = accountRepository.findById(id);
		
		return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Query Account successfully");
				setData(foundAccount);
			}
		}));
	}

	@Override
	public ResponseEntity<ResponseObject> getAllAccount() {
		List<Account> foundUser = accountRepository.findAll();

		return ResponseEntity.status(HttpStatus.OK).body(iResponseObjectService.success(new ResponseObject() {
			{
				setMessage("Get all Accounts");
				setCountData(foundUser.size());
				setData(foundUser);
			}
		}));
	}
}
