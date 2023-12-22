package hcmute.kltn.Backend.model.account.service.impl;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import hcmute.kltn.Backend.model.account.dto.AccountSetRole;
import hcmute.kltn.Backend.model.account.dto.AccountUpdateProfile;
import hcmute.kltn.Backend.model.account.dto.AuthRequest;
import hcmute.kltn.Backend.model.account.dto.AuthResponse;
import hcmute.kltn.Backend.model.account.dto.ChangePassword;
import hcmute.kltn.Backend.model.account.dto.RegisterRequest;
import hcmute.kltn.Backend.model.account.dto.ResetPasswordReq;
import hcmute.kltn.Backend.model.account.dto.entity.Account;
import hcmute.kltn.Backend.model.account.dto.extend.ResetPassword;
import hcmute.kltn.Backend.model.account.repository.AccountRepository;
import hcmute.kltn.Backend.model.account.service.IAccountDetailService;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.base.ERole;
import hcmute.kltn.Backend.model.base.image.service.IImageService;
import hcmute.kltn.Backend.model.email.dto.EmailDTO;
import hcmute.kltn.Backend.model.email.service.IEmailService;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;
import hcmute.kltn.Backend.util.LocalDateTimeUtil;
import hcmute.kltn.Backend.util.LocalDateUtil;
import hcmute.kltn.Backend.util.StringUtil;

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
	@Autowired
	private IEmailService iEmailService;

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
		
		// new date
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();
		account.setCreatedAt2(currentDate);
		account.setLastModifiedAt2(currentDate);

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
		
		// new date
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();
		account.setLastModifiedAt2(currentDate);

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
	
	private String getRole(String role) {
		int index = 0;
		try {
			index = Integer.valueOf(role);
		} catch (Exception e) {
			throw new CustomException("The role does not exist");
		}
		
		
		Map<String, String> roleMap = new HashMap<>();
		
		int roleId = 1;
		for (ERole value : ERole.values()) {
			roleMap.put(String.valueOf(roleId), String.valueOf(value));
			roleId++;
		}
		
		return roleMap.get(role);
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

	@Override
	public void setRole(AccountSetRole accountSetRole) {
		String role = getRole(accountSetRole.getRole());
		if (role == null || role.equals("")) {
			throw new CustomException("The role does not exist");
		}
		
		Account account = new Account();
		account = getDetail(accountSetRole.getAccountId());
		
		account.setRole(role);
		update(account);
	}

	@Override
	public void changePassword(ChangePassword changePassword) {
		String password = new BCryptPasswordEncoder().encode(changePassword.getPassword());
		Account account = iAccountDetailService.getCurrentAccount();
		try {
			Authentication authentication = authManager.authenticate(
	                new UsernamePasswordAuthenticationToken(
	                		account.getEmail(), changePassword.getPassword())
	        );
		} catch (Exception e) {
			throw new CustomException("Incorrect password");
		}
		
		if (changePassword.getNewPassword() != null && !changePassword.getNewPassword().equals("")) {
			String newPassword = new BCryptPasswordEncoder().encode(changePassword.getNewPassword());
			account.setPassword(newPassword);
			update(account);
			
			// send notification mail
			EmailDTO emailDTO = new EmailDTO();
			emailDTO.setTo(account.getEmail());
			emailDTO.setSubject("Thay đổi mật khẩu thành công trên Travelover");
			emailDTO.setContent("Chào " + account.getFirstName() + ",<br>\r\n"
					+ "<br>\r\n"
					+ "Chúng tôi gửi email này để thông báo rằng mật khẩu cho tài khoản của bạn "
					+ "trên Travelover đã được thay đổi thành công.<br>\r\n"
					+ "<br>\r\n"
					+ "Nếu bạn không yêu cầu thay đổi mật khẩu, "
					+ "vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi ngay lập tức.<br>\r\n"
					+ "<br>\r\n"
					+ "Cảm ơn bạn đã sử dụng Travelover.<br>\r\n"
					+ "<br>\r\n"
					+ "Trân trọng,<br>\r\n"
					+ "Đội ngũ Travelover.");
			iEmailService.sendMail(emailDTO);
		}
	}

	@Override
	public void resetPassword(ResetPasswordReq resetPasswordReq) {
		// find account with email
		Optional<Account> accountFind = accountRepository.findByEmail(resetPasswordReq.getEmail());
		if (accountFind.isEmpty()) {
			throw new CustomException("Email has not been used to sign up for an account");
		}
		Account account = new Account();
		account = accountFind.get();
		
		// check create reset password
		if (account.getResetPassword() == null) {
			throw new CustomException("Invalid verification code");
		}
		
		// check code
		if (!resetPasswordReq.getCode().equals(account.getResetPassword().getCode())) {
			throw new CustomException("Invalid verification code");
		}
		
		// check expire
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();
		LocalDateTime endDate = account.getResetPassword().getCreateAt().plusMinutes(30);
		if (currentDate.isAfter(endDate)) {
			throw new CustomException("Invalid verification code");
		}
		
		// update new password
		if (resetPasswordReq.getNewPassword() != null && !resetPasswordReq.getNewPassword().equals("")) {
			String newPassword = new BCryptPasswordEncoder().encode(resetPasswordReq.getNewPassword());
			account.setPassword(newPassword);
			account.setResetPassword(null);
			update(account);
			
			// send notification mail
			EmailDTO emailDTO = new EmailDTO();
			emailDTO.setTo(account.getEmail());
			emailDTO.setSubject("Thay đổi mật khẩu thành công trên Travelover");
			emailDTO.setContent("Chào " + account.getFirstName() + ",<br>\r\n"
					+ "<br>\r\n"
					+ "Chúng tôi gửi email này để thông báo rằng mật khẩu cho tài khoản của bạn "
					+ "trên Travelover đã được thay đổi thành công.<br>\r\n"
					+ "<br>\r\n"
					+ "Nếu bạn không yêu cầu thay đổi mật khẩu, "
					+ "vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi ngay lập tức.<br>\r\n"
					+ "<br>\r\n"
					+ "Cảm ơn bạn đã sử dụng Travelover.<br>\r\n"
					+ "<br>\r\n"
					+ "Trân trọng,<br>\r\n"
					+ "Đội ngũ Travelover.");
			iEmailService.sendMail(emailDTO);
		}
		
	}

	@Override
	public void requestResetPassword(String email) {
		// find account with email
		Optional<Account> accountFind = accountRepository.findByEmail(email);
		if (accountFind.isEmpty()) {
			throw new CustomException("Email has not been used to sign up for an account");
		}
		Account account = new Account();
		account = accountFind.get();
		
		// create code for reset password
		String code = StringUtil.genRandomInteger(6);
		while (code.startsWith("0")) {
			code = StringUtil.genRandomInteger(6);
		}
		LocalDateTime currentDate = LocalDateTimeUtil.getCurentDate();
		
		ResetPassword resetPassword = new ResetPassword();
		resetPassword.setCode(code);
		resetPassword.setCreateAt(currentDate);
		
		account.setResetPassword(resetPassword);
		accountRepository.save(account);
		
		// send mail
		EmailDTO emailDTO = new EmailDTO();
		emailDTO.setTo(email);
		emailDTO.setSubject("Đặt lại mật khẩu cho tài khoản Travelover của bạn");
		emailDTO.setContent("Chào " + account.getFirstName() + ",<br>\r\n"
				+ "<br>\r\n"
				+ "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn trên Travelover. "
				+ "Mã xác nhận của bạn là: " + code + "<br>\r\n"
				+ "<br>\r\n"
				+ "Vui lòng nhập mã này vào trang đặt lại mật khẩu trên Travelover của chúng tôi. "
				+ "Mã xác nhận này sẽ hết hạn sau 30 phút.<br>\r\n"
				+ "<br>\r\n"
				+ "Nếu bạn không yêu cầu đặt lại mật khẩu, "
				+ "vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.<br>\r\n"
				+ "<br>\r\n"
				+ "Trân trọng,<br>\r\n"
				+ "Đội ngũ Travelover.");
		iEmailService.sendMail(emailDTO);
	}

	private void test() {
		String test = "Chào [Tên người dùng],<br>\r\n"
				+ "\r\n"
				+ "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn trên [Tên ứng dụng/website]. Mã xác nhận của bạn là: 123456\r\n"
				+ "\r\n"
				+ "Vui lòng nhập mã này vào trang đặt lại mật khẩu trên [Tên ứng dụng/website] của chúng tôi. Mã xác nhận này sẽ hết hạn sau 30 phút.\r\n"
				+ "\r\n"
				+ "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.\r\n"
				+ "\r\n"
				+ "Trân trọng,\r\n"
				+ "[Đội ngũ hỗ trợ]\r\n"
				+ "";
	}

}
