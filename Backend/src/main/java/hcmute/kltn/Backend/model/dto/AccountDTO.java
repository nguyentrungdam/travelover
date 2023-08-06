package hcmute.kltn.Backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
	private String accountId;
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String role;
	private String avatar; // Foreign key
	private String address;
	private String phoneNumber;
	private String parentAccount; // Foreign key
}
