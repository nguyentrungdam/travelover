package hcmute.kltn.Backend.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@MappedSuperclass
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseEntity {
	@Column(name = "Status", nullable = false)
	private boolean status;
	@Column(name = "Created_By", nullable = false)
	private String createdBy;
	@Column(name = "Created_At", nullable = false)
	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date createdAt;
	@Column(name = "Last_Modified_By", nullable = false)
	private String lastModifiedBy;
	@Column(name = "Last_Modified_At", nullable = false)
	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date lastModifiedAt;
	
	public boolean getStatus() {
		return this.status;
	}
}
