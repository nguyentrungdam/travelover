package hcmute.kltn.Backend.model.account.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.ArrayList;
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
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
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
    
    private void checkFieldCondition(Account account) {
		// check null
		if (account.getEmail() == null || account.getEmail().equals("")) {
			throw new CustomException("Email is not null");
		} 
		if (account.getFirstName() == null || account.getFirstName().equals("")) {
			throw new CustomException("First Name is not null");
		} 
		if (account.getLastName() == null || account.getLastName().equals("")) {
			throw new CustomException("Last Name is not null");
		} 
//		if (account.getPassword() == null || account.getPassword().equals("")) {
//			throw new CustomException("First Name is not null");
//		}
		
		// check unique
		if(account.getAccountId() == null || account.getAccountId().equals("")) {
			if (accountRepository.existsByEmail(account.getEmail().trim())) {
				throw new CustomException("Email is already");
			} 
		} else {
			Account accountFind = accountRepository.findById(account.getAccountId()).get();
			List<Account> listByEmail = accountRepository.findAllByEmail(accountFind.getEmail());
			for (Account item : listByEmail) {
				if (item.getEmail() == accountFind.getEmail() && item.getAccountId() != accountFind.getAccountId()) {
					throw new CustomException("Email is already");
				}
			}
		}
	}
    
    private Account create(Account account) {
		// check field condition
		checkFieldCondition(account); 

		// Set default value
		String accountId = iGeneratorSequenceService.genId(getCollectionName());
		LocalDate dateNow = LocalDateUtil.getDateNow();
		account.setAccountId(accountId);
		account.setStatus(true);			
		account.setCreatedBy(accountId);
		account.setCreatedAt(dateNow);
		account.setLastModifiedBy(accountId);
		account.setLastModifiedAt(dateNow);

		// create account
		Account accountNew = new Account();
		accountNew = accountRepository.save(account);
		
		return accountNew;
	}
    
    private Account update(Account account) {
		// Check exists
		if (!accountRepository.existsById(account.getAccountId())) {
			throw new CustomException("Cannot find account");
		} 
		
		// check field condition
		checkFieldCondition(account); 
		
		// Set default value
		String currentAccountId = iAccountDetailService.getCurrentAccount().getAccountId();
		account.setLastModifiedBy(currentAccountId);
		account.setLastModifiedAt(LocalDateUtil.getDateNow());

		// update account
		Account accountNew = new Account();
		accountNew = accountRepository.save(account);

		return accountNew;
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
	
	private void delete(String id) {
		// check exists
		if (accountRepository.existsById(id)) {
			accountRepository.deleteById(id);
		} 
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
			criteriaList.add(Criteria.where("_id").is(keyword));

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
	
	private AccountDTO getAccountDTO(Account account) {
		AccountDTO accountDTONew = new AccountDTO();
		modelMapper.map(account, accountDTONew);
		return accountDTONew;
	}
	
	private List<AccountDTO> getAccountDTOList(List<Account> accountList) {
		List<AccountDTO> accountDTOList = new ArrayList<>();
		for (Account itemAccount : accountList) {
			accountDTOList.add(getAccountDTO(itemAccount));
		}
		return accountDTOList;
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
	public AccountDTO register(RegisterRequest registerRequest) {
		// create hash password
		if (registerRequest.getPassword() == null || registerRequest.getPassword().equals("")) {
			throw new CustomException("Password is not null");
		}
		String password = new BCryptPasswordEncoder().encode(registerRequest.getPassword());
		
		// mapping account
		Account account = new Account();
		modelMapper.map(registerRequest, account);
		
		// set default value
		account.setRole("CUSTOMER");
		account.setPassword(password);
		
		// create account
		Account accountNew = new Account();
		accountNew = create(account);
		
		return getAccountDTO(accountNew);
	}

	@Override
	public AccountDTO updateProfile(AccountUpdateProfile accountUpdateProfile) {
		// Get current Account 
		Account account = iAccountDetailService.getCurrentAccount();

		// check image and delete old image
		if ((account.getAvatar() != null 
				&& !account.getAvatar().equals(""))
				&& !account.getAvatar().equals(accountUpdateProfile.getAvatar())) {
			boolean checkDelete = false;
			checkDelete = iImageService.deleteImageByUrl(account.getAvatar());
			if (checkDelete == false) {
				throw new CustomException("An error occurred during the processing of the old image");
			}
		}
		
		// mapping account
		modelMapper.map(accountUpdateProfile, account);
		
		// update account
		Account accountNew = new Account();
		accountNew = update(account);
		
		return getAccountDTO(accountNew);
	}
	
	@Override
	public AccountDTO getProfile() {
		// get current account
		Account account = iAccountDetailService.getCurrentAccount();

		return getAccountDTO(account);
	}

	@Override
	public List<AccountDTO> getAllAccount() {
		// get current account list
		List<Account> accountList = new ArrayList<>(getAll());

		return getAccountDTOList(accountList);
	}
	
	@Override
	public AccountDTO getDetailAccount(String accountId) {
		// get account from database
		Account account = getDetail(accountId);

		return getAccountDTO(account);
	}

	@Override
	public List<AccountDTO> searchAccount(String keyword) {
		// search account with keyword
		List<Account> accountList = search(keyword);

		return getAccountDTOList(accountList);
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
		String password = new BCryptPasswordEncoder().encode("123456");
		LocalDate dateNow = LocalDateUtil.getDateNow();
		account.setAccountId(accountId);
		account.setPassword(password);
		account.setStatus(true);			
		account.setCreatedBy(accountId);
		account.setCreatedAt(dateNow);
		account.setLastModifiedBy(accountId);
		account.setLastModifiedAt(dateNow);
 

		account = accountRepository.save(account);
		
		return true;
	}

//	@Override
//	public AccountDTO updateAccount(AccountDTO accountDTO) {
//		// check role
//		boolean isRole = false;
//		for (ERole item : ERole.values()) {
//			if (item.name().equals(accountDTO.getRole())) {
//				isRole = true;
//				break;
//			}
//		}
//		if (isRole == false) {
//			throw new CustomException("Role does not exist");
//		}
//		
//		// get account from db
//		Account account = getDetail(accountDTO.getAccountId());
//		
//		// check image and delete old image
//		if ((account.getAvatar() != null 
//				&& !account.getAvatar().equals(""))
//				&& !account.getAvatar().equals(accountDTO.getAvatar())) {
//			boolean checkDelete = false;
//			checkDelete = iImageService.deleteImageByUrl(account.getAvatar());
//			if (checkDelete == false) {
//				throw new CustomException("An error occurred during the processing of the old image");
//			}
//		}	
//		
//		// Mapping
//		modelMapper.map(accountDTO, account);
//		
//		// update account
//		Account accountNew = new Account();
//		accountNew = update(account);
//		
//		// mapping accountDTO
//		AccountDTO
//		
//		return account;
//	}

}
