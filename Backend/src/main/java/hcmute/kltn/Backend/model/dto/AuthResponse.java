package hcmute.kltn.Backend.model.dto;

import hcmute.kltn.Backend.model.entity.Image;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
	private String firstName;
	private String lastName;
	private String role;
	private Image avatar;
	private String email;
    private String accessToken;
}
