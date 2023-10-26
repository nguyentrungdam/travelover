package hcmute.kltn.Backend.model.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
//	@NotNull
//	@Email
//	@Length(min = 5, max = 50)
	private String email;
//	@NotNull
//	@Length(min = 6, max = 50)
	private String password;
}
