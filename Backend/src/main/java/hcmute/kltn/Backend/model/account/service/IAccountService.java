package hcmute.kltn.Backend.model.account.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.account.dto.AccountDTO;
import hcmute.kltn.Backend.model.account.dto.AccountUpdateProfile;
import hcmute.kltn.Backend.model.account.dto.AuthRequest;
import hcmute.kltn.Backend.model.account.dto.AuthResponse;
import hcmute.kltn.Backend.model.account.dto.RegisterRequest;
import hcmute.kltn.Backend.model.account.dto.entity.Account;

public interface IAccountService {
	public Account register(RegisterRequest registerRequest);
	public Account updateProfile(MultipartFile file, AccountUpdateProfile accountUpdateProfile);
	public Account getProfile();
	public AuthResponse login(AuthRequest request);
	public List<Account> getAllAccount();
	public List<Account> searchAccount(String keyword);
	public Account getDetailAccount(String accountId);
	public Account updateAccount(AccountDTO accountDTO);
	public boolean initData(AccountDTO accountDTO);
}
