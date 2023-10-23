package hcmute.kltn.Backend.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("test_mongodb")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestMongoDB {
	@Id
	private String id;
	private String tableName; // unique
	private String prefix; // unique
	private long number; // not null
	private String description;
}
