package hcmute.kltn.Backend.service.intf;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import hcmute.kltn.Backend.model.dto.AccountDTO;
import hcmute.kltn.Backend.model.dto.AccountUpdateProfile;
import hcmute.kltn.Backend.model.dto.AuthRequest;
import hcmute.kltn.Backend.model.dto.AuthResponse;
import hcmute.kltn.Backend.model.dto.RegisterRequest;
import hcmute.kltn.Backend.model.entity.Account;

public interface IAccountService {
	public Account create(AccountDTO accountDTO);
	public Account update(AccountDTO accountDTO);
	public boolean delete(String id);
	public Account getDetail(String accountId);
	public List<Account> getAll();
	
	public Account register(RegisterRequest registerRequest);
	public Account updateProfile(MultipartFile file, AccountUpdateProfile accountUpdateProfile);
	public AuthResponse login(AuthRequest request);
	public boolean initData(AccountDTO accountDTO);
}
