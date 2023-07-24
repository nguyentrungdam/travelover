package hcmute.kltn.Backend.model.entity;

import java.util.Collection;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Account")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account implements UserDetails{
	@Id
	@JsonProperty(access = Access.READ_ONLY)
	@Column(name = "Account_Id")
	private String accountId;
	@Column(name = "First_Name", unique = false, nullable = false)
	private String firstName;
	@Column(name = "Last_Name", unique = false, nullable = false)
	private String lastName;
	@Column(name = "Email", unique = true, nullable = false)
	private String email;
	@Column(name = "Password", nullable = false)
	@JsonProperty(access = Access.WRITE_ONLY)
	private String password;
	@Column(name = "Role", nullable = false)
	private String role;
	@Column(name = "Avatar", nullable = true)
	private String avatar;
	@Column(name = "Address", nullable = true)
	private String address;
	@Column(name = "Phone_Number", nullable = true)
	private String phoneNumber;
	@Column(name = "Parent_Id", nullable = true)
	private String parentId;
	
	@Column(name = "Created_By", nullable = false)
	@CreatedBy
	@JsonProperty(access = Access.READ_ONLY)
	private String createdBy;
	@Column(name = "Created_At", nullable = false)
	@CreatedDate
	@JsonFormat(pattern = "dd/MM/yyyy")
	@JsonProperty(access = Access.READ_ONLY)
	private Date createdAt;
	@Column(name = "Last_Modified_By", nullable = false)
	@LastModifiedBy
	@JsonProperty(access = Access.READ_ONLY)
	private String lastModifiedBy;
	@Column(name = "Last_Modified_At", nullable = false)
	@LastModifiedDate
	@JsonFormat(pattern = "dd/MM/yyyy")
	@JsonProperty(access = Access.READ_ONLY)
	private Date lastModifiedAt;
	
	@Override
	@JsonIgnore
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	@JsonIgnore
	public String getUsername() {
		// TODO Auto-generated method stub
		return this.email;
	}
	@Override
	@JsonIgnore
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	@JsonIgnore
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	@JsonIgnore
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	@JsonIgnore
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
}
