package hcmute.kltn.Backend.component;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import hcmute.kltn.Backend.model.account.dto.AccountDTO;
import hcmute.kltn.Backend.model.account.dto.extend.Notification;
import hcmute.kltn.Backend.model.account.service.IAccountService;
import hcmute.kltn.Backend.model.generatorSequence.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.generatorSequence.service.IGeneratorSequenceService;

@Component
public class DataLoader implements CommandLineRunner {
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private IAccountService iAccountService;
	
	private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);
	
	@Value("${server.port}")
    private String portServer;

	@Override
	public void run(String... args) throws Exception {
//		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//		Date nowDate = new Date();
		
		// GEN DATA FOR GENERATOR SEQUENCE TABLE
		// TableName = Account, Prefix = ACC, Description = table Account
		// TableName = Image, Prefix = IMG, Description = table Image
		// TableName = Tour, Prefix = TR, Description = table Tour
		boolean initCheck = true;
		
		GeneratorSequenceDTO genGenSeqAccount = new GeneratorSequenceDTO();
		genGenSeqAccount.setCollectionName("account");
		genGenSeqAccount.setPrefix("ACC");
		genGenSeqAccount.setNumber(0);
		genGenSeqAccount.setDescription("table Account");
		initCheck = iGeneratorSequenceService.initData(genGenSeqAccount);
		if (initCheck) {
			logger.info("Success to gen data for Generator Sequence table: "
					+ "TableName = Account, Prefix = ACC, Description = table Account");
		} 
		
		
		GeneratorSequenceDTO genGenSeqImage = new GeneratorSequenceDTO();
		genGenSeqImage.setCollectionName("image");
		genGenSeqImage.setPrefix("IMG");
		genGenSeqImage.setNumber(0);
		genGenSeqImage.setDescription("table Image");
		initCheck = iGeneratorSequenceService.initData(genGenSeqImage);
		if (initCheck) {
			logger.info("Success to gen data for Generator Sequence table: "
					+ "TableName = Image, Prefix = IMG, Description = table Image");
		} 
		
		GeneratorSequenceDTO genGenSeqTour = new GeneratorSequenceDTO();
		genGenSeqTour.setCollectionName("tour");
		genGenSeqTour.setPrefix("TR");
		genGenSeqTour.setNumber(0);
		genGenSeqTour.setDescription("table Tour");
		initCheck = iGeneratorSequenceService.initData(genGenSeqTour);
		if (initCheck) {
			logger.info("Success to gen data for Generator Sequence table: "
					+ "TableName = Tour, Prefix = TR, Description = table Tour");
		} 
		
		// GEN DATA FOR ACCOUNT TABLE
		// FirstName = dev, LastName = dev, Email = dev@gmail.com, Password = 123456, Role = SUPER_ADMIN
		
		AccountDTO user1 = new AccountDTO();
		user1.setFirstName("dev");
		user1.setLastName("dev");
		user1.setEmail("dev@gmail.com");
		user1.setPassword("123456");
		user1.setRole("ADMIN");
		initCheck = iAccountService.initData(user1);
		if (initCheck) {
			logger.info("Success to gen data for Account table: "
					+ "FirstName = dev, LastName = dev, Email = dev@gmail.com, Password = 123456, Role = ADMIN");
		} 
		
//		List<Notification> notiList2 = new ArrayList();
//		Notification noti2 = new Notification();
//		AccountDTO user2 = new AccountDTO();
//		user2.setFirstName("test");
//		user2.setLastName("test");
//		user2.setEmail("test@gmail.com");
//		user2.setPassword("123456");
//		user2.setRole("ADMIN");
//		noti2.setTitle("Login success");
//		noti2.setLink("google.com");
//		notiList2.add(noti2);
//		user2.setNotification(notiList2);
//		initCheck = iAccountService.initData(user2);
//		if (initCheck) {
//			logger.info("Success to gen data for Account table: "
//					+ "FirstName = test, LastName = test, Email = test@gmail.com, Password = 123456, Role = ADMIN");
//		}

    	String linkServer = "http://localhost:" + portServer + "/swagger-ui/index.html";
		
		logger.info("Server is running on: " + linkServer);
		System.out.println("Initialized database");
        System.out.println("Server is running on: " + linkServer);
	}
}
