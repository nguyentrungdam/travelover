package hcmute.kltn.Backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import hcmute.kltn.Backend.model.entity.Account;

public interface AccountRepository extends MongoRepository<Account, String>{
	Optional<Account> findByEmail(String email);
	List<Account> findAllByEmail(String email);
	boolean existsByEmail(String email);
}
