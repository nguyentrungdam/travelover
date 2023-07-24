package hcmute.kltn.Backend.service.intf;

import org.springframework.http.ResponseEntity;

import hcmute.kltn.Backend.model.dto.AuthRequest;
import hcmute.kltn.Backend.model.dto.RegisterRequest;
import hcmute.kltn.Backend.model.dto.ResponseObject;
import hcmute.kltn.Backend.model.dto.UpdateAccountRequest;

public interface IAccountService {
	public ResponseEntity<ResponseObject> register(RegisterRequest registerRequest);
	public ResponseEntity<ResponseObject> updateAccount(UpdateAccountRequest updateAccountRequest);
	public ResponseEntity<ResponseObject> deleteAccount(String id);
	public ResponseEntity<ResponseObject> getDetailAccount();
	public ResponseEntity<ResponseObject> getAllAccount();
	public ResponseEntity<ResponseObject> login(AuthRequest request);
}
