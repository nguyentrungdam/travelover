package hcmute.kltn.Backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestMongoDBDTO {
	private String id;
	private String tableName;
	private String prefix;
	private long number; 
	private String description;
}
