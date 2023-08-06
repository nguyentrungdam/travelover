package hcmute.kltn.Backend.component;

import java.util.Date;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import hcmute.kltn.Backend.model.entity.GeneratorSequence;
import hcmute.kltn.Backend.model.entity.Account;
import hcmute.kltn.Backend.repository.GeneratorSequenceRepository;
import hcmute.kltn.Backend.repository.AccountRepository;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;

@Component
public class DataLoader implements CommandLineRunner {
	@Autowired
	private GeneratorSequenceRepository generatorSequenceRepository;
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private AccountRepository accountRepository;
	
	private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

	@Override
	public void run(String... args) throws Exception {
//		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//		Date nowDate = new Date();
//		
//		GeneratorSequence genSeqUser = new GeneratorSequence();
//		genSeqUser.setTableName("Account");
//		genSeqUser.setPrefix("ACC");
//		genSeqUser.setDescription("table Account");
//		generatorSequenceRepository.save(genSeqUser);
//		logger.info("Generator Sequence for Account table");
//		
//		Account user = new Account();
//		user.setAccountId(iGeneratorSequenceService.genID("Account"));
//		user.setFirstName("Thanh");
//		user.setLastName("Tran");
//		user.setEmail("thanhdt114@gmail.com");
//		user.setPassword(passwordEncoder.encode("123456"));
//		user.setRole("ROLE_SUPER_ADMIN");
//		user.setCreatedBy("dev");
//		user.setCreatedAt(nowDate);
//		user.setLastModifiedBy("dev");
//		user.setLastModifiedAt(nowDate);
//		accountRepository.save(user);
//		logger.info("User generator");
//		
//		Account user2 = new Account();
//		user2.setAccountId(iGeneratorSequenceService.genID("Account"));
//		user2.setFirstName("admin");
//		user2.setLastName("admin");
//		user2.setEmail("admin@gmail.com");
//		user2.setPassword(passwordEncoder.encode("123456"));
//		user2.setRole("ROLE_SUPER_ADMIN");
//		user2.setCreatedBy("dev");
//		user2.setCreatedAt(nowDate);
//		user2.setLastModifiedBy("dev");
//		user2.setLastModifiedAt(nowDate);
//		user2.setParentAccount(user);
//		accountRepository.save(user2);
//		logger.info("User2 generator");
		
		System.out.println("Initializr database");
	}
}
