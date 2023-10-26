package hcmute.kltn.Backend.model.account.dto.extend;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
	private String title;
	private String description;
	private String link;
	private String imageUrl;
	private Date createAt;
	private boolean status;
}
