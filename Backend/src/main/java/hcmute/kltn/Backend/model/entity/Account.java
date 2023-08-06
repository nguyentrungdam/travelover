package hcmute.kltn.Backend.model.entity;

import java.util.Collection;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import hcmute.kltn.Backend.model.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Account")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class Account extends BaseEntity implements UserDetails{
	@Id
	@Column(name = "Account_Id")
	private String accountId;
	@Column(name = "First_Name", nullable = false)
	private String firstName;
	@Column(name = "Last_Name", nullable = false)
	private String lastName;
	@Column(name = "Email", unique = true, nullable = false)
	private String email;
	@Column(name = "Password", nullable = false)
	private String password;
	@Column(name = "Role", nullable = false)
	private String role;
	@OneToOne
    @JoinColumn(name = "avatar", nullable = true)
	private Image avatar;
	@Column(name = "Address", nullable = true)
	private String address;
	@Column(name = "Phone_Number", nullable = true)
	private String phoneNumber;
	@OneToOne
    @JoinColumn(name = "Parent_Id", nullable = true)
	private Account parentAccount;
	
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
