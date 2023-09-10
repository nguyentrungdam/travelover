package hcmute.kltn.Backend.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.persistence.Table;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.component.JwtTokenUtil;
import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.ERole;
import hcmute.kltn.Backend.model.dto.AccountDTO;
import hcmute.kltn.Backend.model.dto.AccountUpdateProfile;
import hcmute.kltn.Backend.model.dto.AuthRequest;
import hcmute.kltn.Backend.model.dto.AuthResponse;
import hcmute.kltn.Backend.model.dto.ImageDTO;
import hcmute.kltn.Backend.model.dto.RegisterRequest;
import hcmute.kltn.Backend.model.entity.Account;
import hcmute.kltn.Backend.model.entity.Image;
import hcmute.kltn.Backend.repository.AccountRepository;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;
import hcmute.kltn.Backend.service.intf.IImageService;
import hcmute.kltn.Backend.util.DateUtil;
import hcmute.kltn.Backend.service.AccountDetailsService;
import hcmute.kltn.Backend.service.intf.IAccountService;

@Service
public class AccountService implements IAccountService{
	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private IImageService iImageService;
	@Autowired 
	private AuthenticationManager authManager;
    @Autowired 
    private JwtTokenUtil jwtUtil;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
	private AccountDetailsService accountDetailsService;

	private String tableName = Account.class.getAnnotation(Table.class).name();
	
	@Override
	public AuthResponse login(AuthRequest request) {
		Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String accessToken = jwtUtil.generateAccessToken(user);
        
        Account account = accountRepository.findByEmail(request.getEmail()).get();
        
        AuthResponse response = new AuthResponse(
        		account.getFirstName(), 
        		account.getLastName(), 
        		account.getRole(), 
        		account.getAvatar(), 
        		user.getUsername(), 
        		accessToken);
        
        return response;
    }

	@Override
	public Account register(RegisterRequest registerRequest) {
		// Mapping
		AccountDTO accountDTO = new AccountDTO();
		modelMapper.map(registerRequest, accountDTO);
		
		return create(accountDTO);
	}

	@Override
	public Account updateProfile(MultipartFile file, AccountUpdateProfile accountUpdateProfile) {
		// Get Id Account 
		Account account = accountDetailsService.getCurrentAccount();
		
		// Check field foreign key
		if (accountUpdateProfile.getAvatar() != null 
				&& accountUpdateProfile.getAvatar() != ""
				&& accountUpdateProfile.getAvatar() != account.getAvatar().getImageId()) {
			throw new CustomException("Invalid foreign key");
		}

		// Mapping
		AccountDTO accountDTO = new AccountDTO();
		modelMapper.map(account, accountDTO);
		modelMapper.map(accountUpdateProfile, accountDTO);
		
		// Check image
		if (file != null) {
			if (accountDTO.getAvatar() == null || accountDTO.getAvatar() == "") {
				Image image = iImageService.createImage(tableName, file);
				accountDTO.setAvatar(image.getImageId());
			} else {
				Image image = iImageService.getDetail(accountDTO.getAvatar());
				ImageDTO imageDTO = new ImageDTO();
				modelMapper.map(image, imageDTO);
				
				iImageService.updateImage(imageDTO, file);
			}	
		}
		
		return update(accountDTO);
	}

	@Override
	public boolean delete(String id) {
		boolean exists = accountRepository.existsById(id);
		if (!exists) {
			throw new CustomException("Cannot find Account");
		} 
		
		accountRepository.deleteById(id);
		
		return true;
	}

	@Override
	public Account getDetail(String accountId) {
		boolean exists = accountRepository.existsById(accountId);
		if (!exists) {
			throw new CustomException("Cannot find Account");
		} 
		
		Account account = accountRepository.findById(accountId).get();
		
		return account;
	}

	@Override
	public List<Account> getAll() {
		List<Account> foundAccount = accountRepository.findAll();
		
		return foundAccount;
	}

	@Override
	public Account create(AccountDTO accountDTO) {
		// Check already
		boolean existsEmail = accountRepository.existsByEmail(accountDTO.getEmail().trim());
		if (existsEmail) {
			throw new CustomException("Email is already");
		} 
		
		boolean isRole = false;
		for (ERole item : ERole.values()) {
			if (item.name().equals(accountDTO.getRole())) {
				isRole = true;
				break;
			}
		}
		if (isRole == false) {
			throw new CustomException("Role does not exist");
		}
		
		// Mapping
		Account account = new Account();
		modelMapper.map(accountDTO, account);

		// Set default value
		String accountId = iGeneratorSequenceService.genId(tableName);
		String password = new BCryptPasswordEncoder().encode(account.getPassword());
		Date dateNow = DateUtil.getDateNow();
		account.setAccountId(accountId);
		account.setPassword(password);
		account.setStatus(true);			
		account.setCreatedBy(accountId);
		account.setCreatedAt(dateNow);
		account.setLastModifiedBy(accountId);
		account.setLastModifiedAt(dateNow);
		
		// Set avatar
		if (accountDTO.getAvatar() != null && accountDTO.getAvatar() != "") {
			Image image = iImageService.getDetail(accountDTO.getAvatar());
			account.setAvatar(image);
		} 
		
		// Set parentAccount
		if (accountDTO.getParentAccount() != null && accountDTO.getParentAccount() != "") {
			Account parentAccount = getDetail(accountDTO.getParentAccount());
			account.setParentAccount(parentAccount);
		} 

		account = accountRepository.save(account);
		
		return account;
	}

	@Override
	public Account update(AccountDTO accountDTO) {
		// Check exists
		boolean exists = accountRepository.existsById(accountDTO.getAccountId());
		if (!exists) {
			throw new CustomException("Cannot find account");
		} 
		
		// Mapping
		Account account = accountRepository.findById(accountDTO.getAccountId()).get();

		// Mapping
		modelMapper.map(accountDTO, account);

		// Check already
		List<Account> listByEmail = accountRepository.findAllByEmail(account.getEmail());
		for (Account item : listByEmail) {
			if (item.getEmail() == account.getEmail() && item.getAccountId() != account.getAccountId()) {
				throw new CustomException("Email is already");
			}
		}
		
		// Set default value
		String currentAccountId = accountDetailsService.getCurrentAccount().getAccountId();
		String password = new BCryptPasswordEncoder().encode(account.getPassword());
		account.setPassword(password);
		account.setLastModifiedBy(currentAccountId);
		account.setLastModifiedAt(DateUtil.getDateNow());
		
		// Set avatar
		Image image = new Image();
		if (accountDTO.getAvatar() == null || accountDTO.getAvatar() == "") {
			image = null;
		} else {
			image = iImageService.getDetail(accountDTO.getAvatar());
			
			// Set avatar null
			account.setAvatar(null);
			account = accountRepository.save(account);
		}
		account.setAvatar(image);
		
		// Set parentAccount
		Account parentAccount = new Account();
		if (accountDTO.getParentAccount() == null || accountDTO.getParentAccount() == "") {
			parentAccount = null;
		} else {
			parentAccount = getDetail(accountDTO.getParentAccount());
			
			// Set parentAccount null
			account.setParentAccount(null);
			account = accountRepository.save(account);
		}
		account.setParentAccount(parentAccount);
		
		account = accountRepository.save(account);

		return account;
	}

	@Override
	public boolean initData(AccountDTO accountDTO) {
		// Check already
		boolean existsEmail = accountRepository.existsByEmail(accountDTO.getEmail().trim());
		if (existsEmail) {
			return false;
		} 
		
		boolean isRole = false;
		for (ERole item : ERole.values()) {
			if (item.name().equals(accountDTO.getRole())) {
				isRole = true;
				break;
			}
		}
		if (isRole == false) {
			return false;
		}
		
		// Mapping
		Account account = new Account();
		modelMapper.map(accountDTO, account);

		// Set default value
		String accountId = iGeneratorSequenceService.genId(tableName);
		String password = new BCryptPasswordEncoder().encode(account.getPassword());
		Date dateNow = DateUtil.getDateNow();
		account.setAccountId(accountId);
		account.setPassword(password);
		account.setStatus(true);			
		account.setCreatedBy(accountId);
		account.setCreatedAt(dateNow);
		account.setLastModifiedBy(accountId);
		account.setLastModifiedAt(dateNow);
		
		// Set avatar
		if (accountDTO.getAvatar() != null && accountDTO.getAvatar() != "") {
			Image image = iImageService.getDetail(accountDTO.getAvatar());
			account.setAvatar(image);
		} 
		
		// Set parentAccount
		if (accountDTO.getParentAccount() != null && accountDTO.getParentAccount() != "") {
			Account parentAccount = getDetail(accountDTO.getParentAccount());
			account.setParentAccount(parentAccount);
		} 

		account = accountRepository.save(account);
		
		return true;
	}
}
