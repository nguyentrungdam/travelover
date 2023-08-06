package hcmute.kltn.Backend.model.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
	@NotNull
	@Email
	@Length(min = 5, max = 50)
	private String email;
	@NotNull
	@Length(min = 6, max = 50)
	private String password;
}
