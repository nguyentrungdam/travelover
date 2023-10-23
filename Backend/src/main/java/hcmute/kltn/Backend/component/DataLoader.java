package hcmute.kltn.Backend.component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import hcmute.kltn.Backend.model.dto.AccountDTO;
import hcmute.kltn.Backend.model.dto.GeneratorSequenceDTO;
import hcmute.kltn.Backend.model.dto.TestMongoDBDTO;
import hcmute.kltn.Backend.service.intf.IAccountService;
import hcmute.kltn.Backend.service.intf.IGeneratorSequenceService;
import hcmute.kltn.Backend.service.intf.ITestMongoDBService;

@Component
public class DataLoader implements CommandLineRunner {
	@Autowired
	private IGeneratorSequenceService iGeneratorSequenceService;
	@Autowired
	private IAccountService iAccountService;
	
	@Autowired
	private ITestMongoDBService iTestMongoDBService;
	
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
		genGenSeqAccount.setNumber(16);
		genGenSeqAccount.setDescription("table Account");
		initCheck = iGeneratorSequenceService.initData(genGenSeqAccount);
		if (initCheck) {
			logger.info("Success to gen data for Generator Sequence table: "
					+ "TableName = Account, Prefix = ACC, Description = table Account");
		} 
		
		
		GeneratorSequenceDTO genGenSeqImage = new GeneratorSequenceDTO();
		genGenSeqImage.setCollectionName("image");
		genGenSeqImage.setPrefix("IMG");
		genGenSeqImage.setNumber(122);
		genGenSeqImage.setDescription("table Image");
		initCheck = iGeneratorSequenceService.initData(genGenSeqImage);
		if (initCheck) {
			logger.info("Success to gen data for Generator Sequence table: "
					+ "TableName = Image, Prefix = IMG, Description = table Image");
		} 
		
		GeneratorSequenceDTO genGenSeqTour = new GeneratorSequenceDTO();
		genGenSeqTour.setCollectionName("tour");
		genGenSeqTour.setPrefix("TR");
		genGenSeqTour.setNumber(2);
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

		System.out.println("Initialized database");
		
		TestMongoDBDTO testMongoDBDTO1 = new TestMongoDBDTO();
		testMongoDBDTO1.setDescription("description test");
		testMongoDBDTO1.setTableName("table name test");
		testMongoDBDTO1.setPrefix("prefix test");
		testMongoDBDTO1.setNumber(10);
		initCheck = iTestMongoDBService.initData(testMongoDBDTO1);
		if (initCheck) {
			logger.info("Success to gen data for MongoDB table: "
					+ "Description = description test, TableName = table name test, Prefix = prefix test, Number = 10");
		} 
		
    	String linkServer = "http://localhost:" + portServer + "/swagger-ui/index.html";
		
		logger.info("Server is running on: " + linkServer);
        System.out.println("Server is running on: " + linkServer);
	}
}
