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
	public Account create(AccountDTO accountDTO);
	public Account update(AccountDTO accountDTO);
	public Account getDetail(String accountId);
	public boolean delete(String id);
	public List<Account> getAll();
	
	public Account register(RegisterRequest registerRequest);
	public Account updateProfile(MultipartFile file, AccountUpdateProfile accountUpdateProfile);
	public AuthResponse login(AuthRequest request);
	public boolean initData(AccountDTO accountDTO);
}
