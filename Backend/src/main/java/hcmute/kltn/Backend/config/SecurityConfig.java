package hcmute.kltn.Backend.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import hcmute.kltn.Backend.component.JwtTokenFilter;
import hcmute.kltn.Backend.model.entity.Account;
import hcmute.kltn.Backend.repository.AccountRepository;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig{
	@Autowired
	private AccountRepository userRepository;
	@Autowired 
	private JwtTokenFilter jwtTokenFilter;
	
	@Bean
    public UserDetailsService userDetailsService() {
		
        return new UserDetailsService() {
             
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            	Optional<Account> user = userRepository.findFirstByEmail(username);
            	if (!user.isPresent()) {
            		throw new UsernameNotFoundException("User not found with username: " + username);
            	} else {
                    List<GrantedAuthority> authorities = new ArrayList<>();
//                    for (ERole role : user.get().getRoles()) {
//                        authorities.add(new SimpleGrantedAuthority(role.toString()));
//                    }
                    authorities.add(new SimpleGrantedAuthority(user.get().getRole()));

                    return new org.springframework.security.core.userdetails.User(
                            user.get().getUsername(),
                            user.get().getPassword(),
                            authorities
                    );
            	} 
            }
        };
    }
     
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
     
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
     
	@Bean
	public SecurityFilterChain configure(HttpSecurity http) throws Exception {

		http.csrf().disable();
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

		http.authorizeRequests()
//				.antMatchers("/api/v1/users/list").hasAuthority("ROLE_ADMIN")
				.anyRequest().permitAll();

		http.exceptionHandling().authenticationEntryPoint((request, response, ex) -> {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
		});

		http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
