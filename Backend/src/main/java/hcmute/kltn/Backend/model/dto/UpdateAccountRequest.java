package hcmute.kltn.Backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAccountRequest {
	private String firstName;
	private String lastName;
	private String password;
	private String role;
	private String avatar;
	private String address;
	private String phoneNumber;
	private String parentId;
}
