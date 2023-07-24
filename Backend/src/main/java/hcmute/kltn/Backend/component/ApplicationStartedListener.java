package hcmute.kltn.Backend.component;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class ApplicationStartedListener implements ApplicationListener<ApplicationStartedEvent> {
	private static final Logger logger = LoggerFactory.getLogger(ApplicationStartedListener.class);
	
	private final Environment environment;
	
	@Autowired
    private DataSource dataSource;
	
	public ApplicationStartedListener(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
    	try (Connection connection = dataSource.getConnection()) {
            logger.info("Connected to database: {}", connection.getMetaData().getURL());
        } catch (SQLException e) {
            logger.error("Failed to connect to database: {}", e.getMessage());
        }
    	
    	String portServer = environment.getProperty("server.port");
    	String linkServer = "http://localhost:" + portServer + "/swagger-ui/index.html";
    	
        logger.info("Server is running on: " + linkServer);
        System.out.println("Server is running on: " + linkServer);
    } 
}
