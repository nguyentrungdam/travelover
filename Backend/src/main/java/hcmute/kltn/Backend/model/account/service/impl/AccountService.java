package hcmute.kltn.Backend.model.account.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.base.ERole;
import hcmute.kltn.Backend.model.base.image.dto.Image;
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.model.tour.dto.TourDTO;
import hcmute.kltn.Backend.model.tour.dto.entity.Tour;
import hcmute.kltn.Backend.util.LocalDateUtil;

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
	private IAccountDetailService iAccountDetailService;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
	private IImageService iImageService;

    private String getCollectionName() {
        String collectionName = mongoTemplate.getCollectionName(Account.class);
        return collectionName;
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
    
    private Account create(AccountDTO accountDTO) {
		// check field condition
		checkFieldCondition(accountDTO); 
		
		// get account from db
		Account account = new Account();
		
		// Mapping
		modelMapper.map(accountDTO, account);

		// Set default value
		String accountId = iGeneratorSequenceService.genId(getCollectionName());
		LocalDate dateNow = LocalDateUtil.getDateNow();
		account.setAccountId(accountId);
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

	private Account update(AccountDTO accountDTO) {
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
		
		// check image and delete old image
		if ((account.getAvatar() != null 
				&& !account.getAvatar().equals(""))
				&& !account.getAvatar().equals(accountDTO.getAvatar())) {
			boolean checkDelete = false;
			checkDelete = iImageService.deleteImageByUrl(account.getAvatar());
			if (checkDelete == false) {
				throw new CustomException("An error occurred during the processing of the old image");
			}
		}
		
		// Mapping
		modelMapper.map(accountDTO, account);
		
//		// check password
//		String passwordDTO = new BCryptPasswordEncoder().encode(accountDTO.getPassword());
		
		// Set default value
		String currentAccountId = iAccountDetailService.getCurrentAccount().getAccountId();
		account.setLastModifiedBy(currentAccountId);
		account.setLastModifiedAt(LocalDateUtil.getDateNow());

		// update account
		account = accountRepository.save(account);

		return account;
	}
	
	private Account getDetail(String accountId) {
		// check exists
		if (!accountRepository.existsById(accountId)) {
			throw new CustomException("Cannot find Account");
		} 
		
		// get account from db
		Account account = accountRepository.findById(accountId).get();
		
		return account;
	}
	
	private List<Account> getAll() {
		// get all account from db
		List<Account> foundAccount = accountRepository.findAll();
		
		return foundAccount;
	}
	
	private boolean delete(String id) {
		// check exists
		if (!accountRepository.existsById(id)) {
			throw new CustomException("Cannot find Account");
		} 
		
		// delete account
		accountRepository.deleteById(id);
		
		return true;
	}

	private List<Account> search(String keyword) {
		// init Account List
		List<Account> accountList = new ArrayList<>();
		
		if(keyword == null || keyword.equals("")) {
			accountList = getAll();
		} else {
			// create list field name
			List<Criteria> criteriaList = new ArrayList<>();
			for(Field itemField : Account.class.getDeclaredFields()) {
				 if (itemField.getType() == String.class) {
					 criteriaList.add(Criteria.where(itemField.getName()).regex(keyword, "i"));
				 }
	    	}

			// create criteria
			Criteria criteria = new Criteria();
	        criteria.orOperator(criteriaList.toArray(new Criteria[0]));
	        
	        // create query
	        Query query = new Query();
	        query.addCriteria(criteria);
			
			// search
			accountList = mongoTemplate.find(query, Account.class);
		}
		
		return accountList;
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
		
		String password = new BCryptPasswordEncoder().encode(accountDTO.getPassword());
		accountDTO.setPassword(password);
		
		Account account = new Account();
		account = create(accountDTO);
		
		return account;
	}

	@Override
	public Account updateProfile(AccountUpdateProfile accountUpdateProfile) {
		// Get Id Account 
		Account account = iAccountDetailService.getCurrentAccount();
		

		// Mapping
		AccountDTO accountDTO = new AccountDTO();
		modelMapper.map(account, accountDTO);
		modelMapper.map(accountUpdateProfile, accountDTO);
		
		Account accountNew = new Account();
		accountNew = update(accountDTO);
		
		return accountNew;
	}
	
	@Override
	public Account getProfile() {
		Account account = iAccountDetailService.getCurrentAccount();

		return account;
	}

	@Override
	public List<Account> getAllAccount() {
		List<Account> accountList = getAll();

		return accountList;
	}
	
	@Override
	public Account getDetailAccount(String accountId) {
		Account account = getDetail(accountId);

		return account;
	}

	@Override
	public List<Account> searchAccount(String keyword) {
		List<Account> accountList = search(keyword);

		return accountList;
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
		LocalDate dateNow = LocalDateUtil.getDateNow();
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

	@Override
	public Account updateAccount(AccountDTO accountDTO) {
		Account account = new Account();
		account = update(accountDTO);
		
		return account;
	}

}
