package hcmute.kltn.Backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hcmute.kltn.Backend.model.entity.Account;

public interface AccountRepository extends JpaRepository<Account, String>{
	Optional<Account> findByEmail(String email);
	List<Account> findAllByEmail(String email);
	boolean existsByEmail(String email);
}
