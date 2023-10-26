package hcmute.kltn.Backend.model.account.service.impl;

import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.component.JwtTokenUtil;
import hcmute.kltn.Backend.exception.CustomException;
import hcmute.kltn.Backend.model.account.dto.AccountDTO;
import hcmute.kltn.Backend.model.account.dto.AccountUpdateProfile;
import hcmute.kltn.Backend.model.account.dto.AuthRequest;
import hcmute.kltn.Backend.model.account.dto.AuthResponse;
import hcmute.kltn.Backend.model.account.dto.RegisterRequest;
import hcmute.kltn.Backend.model.account.dto.entity.Account;
import hcmute.kltn.Backend.model.account.repository.AccountRepository;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.base.ERole;
import hcmute.kltn.Backend.model.base.image.dto.Image;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
//import hcmute.kltn.Backend.service.intf.IImageService;
import hcmute.kltn.Backend.util.DateUtil;

@Service
public class AccountService implements IAccountService{
	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired 
	private AuthenticationManager authManager;
    @Autowired 
    private JwtTokenUtil jwtUtil;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
	private AccountDetailsService accountDetailsService;
    @Autowired
    private MongoTemplate mongoTemplate;

    public String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Account.class);
        return collectionName;
    }
	
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
				&& accountUpdateProfile.getAvatar() != "") {
			throw new CustomException("Invalid foreign key");
		}

		// Mapping
		AccountDTO accountDTO = new AccountDTO();
		modelMapper.map(account, accountDTO);
		modelMapper.map(accountUpdateProfile, accountDTO);
		
		// Check image
//		if (file != null) {
//			if (accountDTO.getAvatar() == null || accountDTO.getAvatar() == "") {
//				Image image = iImageService.createImage(tableName, file);
//				accountDTO.setAvatar(image.getImageId());
//			} else {
//				Image image = iImageService.getDetail(accountDTO.getAvatar());
//				ImageDTO imageDTO = new ImageDTO();
//				modelMapper.map(image, imageDTO);
//				
//				iImageService.updateImage(imageDTO, file);
//			}	
//		}
		
		return update(accountDTO);
	}

	@Override
	public Account create(AccountDTO accountDTO) {
		// check field condition
		checkFieldCondition(accountDTO); 
		
		// get account from db
		Account account = new Account();
		
		// Mapping
		modelMapper.map(accountDTO, account);

		// Set default value
		String accountId = iGeneratorSequenceService.genId(getCollectionName());
		String password = new BCryptPasswordEncoder().encode(account.getPassword());
		Date dateNow = DateUtil.getDateNow();
		account.setAccountId(accountId);
		account.setPassword(password);
		account.setRole("CUSTOMER");
		account.setStatus(true);			
		account.setCreatedBy(accountId);
		account.setCreatedAt(dateNow);
		account.setLastModifiedBy(accountId);
		account.setLastModifiedAt(dateNow);

		// create account
		account = accountRepository.save(account);
		
		return account;
	}

	@Override
	public Account update(AccountDTO accountDTO) {
		// Check exists
		if (!accountRepository.existsById(accountDTO.getAccountId())) {
			throw new CustomException("Cannot find account");
		} 
		
		// check field condition
		checkFieldCondition(accountDTO); 
		
		// check role
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
		
		// get account from db
		Account account = accountRepository.findById(accountDTO.getAccountId()).get();
		
		// Mapping
		modelMapper.map(accountDTO, account);
		
		// Set default value
		String currentAccountId = accountDetailsService.getCurrentAccount().getAccountId();
		String password = new BCryptPasswordEncoder().encode(account.getPassword());
		account.setPassword(password);
		account.setLastModifiedBy(currentAccountId);
		account.setLastModifiedAt(DateUtil.getDateNow());

		// update account
		account = accountRepository.save(account);

		return account;
	}
	
	@Override
	public Account getDetail(String accountId) {
		// check exists
		if (!accountRepository.existsById(accountId)) {
			throw new CustomException("Cannot find Account");
		} 
		
		// get account from db
		Account account = accountRepository.findById(accountId).get();
		
		return account;
	}
	
	@Override
	public boolean delete(String id) {
		// check exists
		if (!accountRepository.existsById(id)) {
			throw new CustomException("Cannot find Account");
		} 
		
		// delete account
		accountRepository.deleteById(id);
		
		return true;
	}
	
	@Override
	public List<Account> getAll() {
		// get all account from db
		List<Account> foundAccount = accountRepository.findAll();
		
		return foundAccount;
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
		String accountId = iGeneratorSequenceService.genId(getCollectionName());
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
//		if (accountDTO.getAvatar() != null && accountDTO.getAvatar() != "") {
//			Image image = iImageService.getDetail(accountDTO.getAvatar());
//			account.setAvatar(image);
//		} 
		
		// Set parentAccount
//		if (accountDTO.getParentAccount() != null && accountDTO.getParentAccount() != "") {
//			Account parentAccount = getDetail(accountDTO.getParentAccount());
//			account.setParentAccount(parentAccount);
//		} 

		account = accountRepository.save(account);
		
		return true;
	}
	
	private void checkFieldCondition(AccountDTO accountDTO) {
		// check null
		if (accountDTO.getEmail() == null || accountDTO.getEmail().equals("")) {
			throw new CustomException("Email is not null");
		} 
		if (accountDTO.getFirstName() == null || accountDTO.getFirstName().equals("")) {
			throw new CustomException("First Name is not null");
		} 
		if (accountDTO.getLastName() == null || accountDTO.getLastName().equals("")) {
			throw new CustomException("First Name is not null");
		} 
		if (accountDTO.getPassword() == null || accountDTO.getPassword().equals("")) {
			throw new CustomException("First Name is not null");
		}
		
		// check unique
		if(accountDTO.getAccountId() == null || accountDTO.getAccountId().equals("")) {
			if (accountRepository.existsByEmail(accountDTO.getEmail().trim())) {
				throw new CustomException("Email is already");
			} 
		} else {
			Account account = accountRepository.findById(accountDTO.getAccountId()).get();
			List<Account> listByEmail = accountRepository.findAllByEmail(account.getEmail());
			for (Account item : listByEmail) {
				if (item.getEmail() == account.getEmail() && item.getAccountId() != account.getAccountId()) {
					throw new CustomException("Email is already");
				}
			}
		}
	}
}
