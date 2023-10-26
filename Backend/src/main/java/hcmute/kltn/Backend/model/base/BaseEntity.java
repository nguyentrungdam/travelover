package hcmute.kltn.Backend.model.base;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseEntity {
	private boolean status; // not null
	private String createdBy; // not null
	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date createdAt; // not null
	private String lastModifiedBy; // not null
	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date lastModifiedAt; // not null
	
	public boolean getStatus() {
		return this.status;
	}
}
